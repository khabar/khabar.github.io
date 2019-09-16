import React from 'react'
import ReactDOM from 'react-dom'
import { Plugins } from '@capacitor/core'

import App from './App'
import * as serviceWorker from './serviceWorker'

const theme = window.localStorage['theme'] || 'dark'
document.body.classList.add(theme)

Plugins.App.addListener('backButton', async () => {
  const { value } = await Plugins.Modals.confirm({
    title: 'Exit',
    message: 'Are you sure you want to exit?',
    cancelButtonTitle: 'No',
    okButtonTitle: 'Yes'
  })

  if (value) Plugins.App.exitApp()
})

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register()
