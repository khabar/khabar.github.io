import { createGlobalState } from 'react-hooks-global-state'
import { Plugins } from '@capacitor/core'

import sources from './sources'
const { path } = sources[0]

const getPersistedState = (key: string) => JSON.parse(window.localStorage[key] || '[]')
const initialState = {
  segment: path,
  loading: false,
  theme: window.localStorage['theme'] || 'dark',
  hackernews: getPersistedState('hackernews'),
  github: getPersistedState('github'),
  echojs: getPersistedState('echojs'),
  devto: getPersistedState('devto'),
  redditprogramming: getPersistedState('redditprogramming'),
  datatau: getPersistedState('datatau'),
  medium: getPersistedState('medium'),
  reddit: getPersistedState('reddit'),
  growthhackers: getPersistedState('growthhackers'),
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

export const toggleTheme = () => {
  let theme = window.localStorage['theme'] || 'dark'
  document.body.classList.remove(theme)
  theme = theme === 'dark' ? 'light' : 'dark'
  document.body.classList.add(theme)
  setGlobalState('theme', theme)
  window.localStorage['theme'] = theme
}

export const setState = async (key: any, value: Array<object | null>) => {
  setGlobalState(key, value)
  window.localStorage[key] = JSON.stringify(value)
  await Plugins.Browser.prefetch({ urls: value.map((x: any) => x.source.targetUrl) })
}

export const setSegment = (value: string) => {
  setGlobalState('segment', value)
}

export { GlobalStateProvider, useGlobalState }
