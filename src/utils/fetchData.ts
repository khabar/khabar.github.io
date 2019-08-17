import { setLoading, setState } from '../state'

const sources = {
  hackernews: 'hackerNews',
  github: 'github',
  echojs: 'echojs',
  devto: 'devto',
  medium: 'medium',
  reddit: 'redditprogramming',
  producthunt: 'productHunt',
}

const baseURL =
  'https://cors-anywhere.herokuapp.com/cdnapi.pnd.gs/v2/feeds?limit=20&page=1&sort=popular&sources='
const options = { headers: { Origin: 'https://khabar.github.io/' } }

const fetchData = async () => {
  try {
    setLoading(true)
    await Promise.all(
      Object.keys(sources).map(
        (key: string, i: number) =>
          new Promise(async (resolve, reject) => {
            try {
              const data = await (await fetch(
                baseURL + Object.values(sources)[i],
                options,
              )).json()
  
              setState(key, data)
              resolve()
            } catch (error) {
              reject(error)
            }
          }),
      ),
    )
  } catch (error) {
    console.error(error)
  } finally {
    setLoading(false)
  }
}

export default fetchData
