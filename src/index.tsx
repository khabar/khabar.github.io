import React from 'react'
import ReactDOM from 'react-dom'
import { isPlatform } from '@ionic/core'

import App from './App'
import * as serviceWorker from './serviceWorker'

const theme = window.localStorage['theme'] || 'dark'
document.body.classList.add(theme)

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
if (!isPlatform('capacitor')) serviceWorker.register()
