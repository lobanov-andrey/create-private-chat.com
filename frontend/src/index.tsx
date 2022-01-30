import React from 'react'
import ReactDOM from 'react-dom'
import Chat from './Components/Chat/Chat'
import './index.sass'
import * as Config from './Utils/Config'
if (!Config.WS_URL) {
  throw 'WS_URL not found, create'
}

ReactDOM.render(
  <React.StrictMode>
    <Chat />
  </React.StrictMode>,
  document.getElementById('root')
)
