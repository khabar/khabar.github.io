import { setLoading, setState } from '../state'

const sources = [
  ['hackernews', '5718e53e7a84fb1901e05971'],
  ['github', '5718e53e7a84fb1901e059cc'],
  ['echojs', '5718e53e7a84fb1901e0592e'],
  ['devto', '5bbb1af8af62ff6841b4b26e'],
  ['medium', '5718e53e7a84fb1901e05929'],
  ['reddit', '5b910ac49642a1e1c6928ab0'],
  ['growthhackers', '5718e53d7a84fb1901e0590f'],
  ['datatau', '5718e53e7a84fb1901e0592f'],
  ['redditprogramming', '59be493f3532e00343101d80'],
  ['producthunt', '5718e53e7a84fb1901e059c7'],
  ['stackoverflow', '5b63425c9642a1e1c6927e9e'],
]
const baseURL =
  'https://cors-anywhere.herokuapp.com/api.usepanda.com/v4/articles?limit=30&page=1&sort=popular&feeds='
const options = { headers: { Origin: 'https://khabar.github.io/' } }
const fetchAndSave = async (key: string, source: string) => {
  const data = (await (await fetch(baseURL + source, options)).json()).filter(
    (x: any) => x.source.likesCount === undefined || x.source.likesCount,
  )

  await setState(key, data)
}

const fetchData = async (sourceKey?: string) => {
  try {
    const now = Date.now()
    const then = +(window.localStorage.getItem('fetchedAt') || 0)

    if (sourceKey) {
      const source = sources.find(([k]) => k === sourceKey)
      if (source) await fetchAndSave(sourceKey, source[1])
    } else if (now - then > 60 * 60 * 1000) {
      window.localStorage.setItem('fetchedAt', '' + now)
      setLoading(true)
      for (let [key, source] of sources) {
        await fetchAndSave(key, source)
      }
    }
  } catch (error) {
    console.error(error)
  } finally {
    setLoading(false)
  }
}

export default fetchData
