import { createGlobalState } from 'react-hooks-global-state'

const getPersistedState = (key: string) => JSON.parse(window.localStorage[key] || '[]')
const initialState = {
  loading: false,
  theme: window.localStorage['theme'] || 'dark',
  hackernews: getPersistedState('hackernews'),
  github: getPersistedState('github'),
  echojs: getPersistedState('echojs'),
  devto: getPersistedState('devto'),
  medium: getPersistedState('medium'),
  reddit: getPersistedState('reddit'),
  producthunt: getPersistedState('producthunt'),
}

const {
  GlobalStateProvider,
  setGlobalState,
  useGlobalState,
} = createGlobalState(initialState)

export const setLoading = (isLoading: boolean) => {
  setGlobalState('loading', isLoading)
}

export const setTheme = (theme: string) => {
  setGlobalState('theme', theme)
  window.localStorage['theme'] = theme
}

export const setState = (key: any, value: Array<object | null>) => {
  setGlobalState(key, value)
  window.localStorage[key] = JSON.stringify(value)
}

export { GlobalStateProvider, useGlobalState }
