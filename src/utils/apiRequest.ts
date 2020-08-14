import { setGlobalStatePersistent } from '../state'

const API_BASEURL = 'https://api.usepanda.com'

const apiRequest = async (path: string, options?: RequestInit) => {
  let status = 500
  try {
    status = (await fetch(API_BASEURL)).status
  } catch {
    //
  }
  if (status === 200) {
    setGlobalStatePersistent('isOffline', false)
    const res = await fetch(API_BASEURL + path, options)
    if (res.ok) return res.json()
  } else {
    setGlobalStatePersistent('isOffline', true)
  }

  throw new Error('We encountered and error while trying to connect to the server.')
}

export default apiRequest
