import { createGlobalState } from 'react-hooks-global-state'

const initialState = {
  isOffline: false,
  sort: 'popular',
  theme: 'dark',
  feeds: [],
  tags: [],
  selectedFeeds: {},
  feedOrder: [],
  ...Object.entries(localStorage).reduce<{ [key: string]: any }>((acc, [key, value]) => {
    try {
      acc[key] = JSON.parse(value)
    } catch {
      acc[key] = value
    }

    return acc
  }, {}),
} as { [key: string]: any }

export const { setGlobalState, useGlobalState } = createGlobalState(initialState)

export const toggleTheme = () => {
  let theme = window.localStorage['theme'] || 'dark'
  document.body.classList.remove(theme)
  theme = theme === 'dark' ? 'light' : 'dark'
  document.body.classList.add(theme)
  setGlobalState('theme', theme)
  window.localStorage['theme'] = theme
}

export const toggleSort = (cb: (s: string) => void) => {
  let sort = window.localStorage['sort'] || 'popular'
  document.body.classList.remove(sort)
  sort = sort === 'popular' ? 'latest' : 'popular'
  document.body.classList.add(sort)
  setGlobalState('sort', sort)
  window.localStorage['sort'] = sort
  cb(sort)
}

export const setGlobalStatePersistent = (key: string, value: any) => {
  setGlobalState(key, value)

  try {
    window.localStorage[key] = JSON.stringify(value)
  } catch {
    window.localStorage[key] = value
  }
}

window.addEventListener('online', () => setGlobalStatePersistent('isOffline', false))
window.addEventListener('offline', () => setGlobalStatePersistent('isOffline', true))
