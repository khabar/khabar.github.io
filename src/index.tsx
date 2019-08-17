import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

const theme = window.localStorage['theme'] || 'dark'
document.body.classList.add(theme)

ReactDOM.render(<App />, document.getElementById('root'))
