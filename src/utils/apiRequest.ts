import { setGlobalStatePersistent } from '../state'

const API_BASEURL = 'https://cors-anywhere.herokuapp.com/https://api.usepanda.com'
const requiredOptions = { headers: { Origin: 'https://khabar.github.io/' } }

const apiRequest = async (path: string, options?: RequestInit) => {
  let status = 500
  const fetchOptions = options
    ? { ...options, headers: { ...(options.headers || {}), ...requiredOptions.headers } }
    : requiredOptions

  try {
    status = (await fetch(API_BASEURL, fetchOptions)).status
  } catch {
    //
  }
  if (status === 200) {
    setGlobalStatePersistent('isOffline', false)
    const res = await fetch(API_BASEURL + path, fetchOptions)
    if (res.ok) return res.json()
  } else {
    setGlobalStatePersistent('isOffline', true)
  }

  throw new Error('We encountered and error while trying to connect to the server.')
}

export default apiRequest
