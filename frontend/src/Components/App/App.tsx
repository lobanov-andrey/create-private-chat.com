import React from 'react'
import Background from '../Background/Background'
import Chat from '../Chat/Chat'
import './app.sass'

export default function App() {
  return (
    <div className="app">
      <div className="app__front">
        <Chat />
      </div>
      <div className="app__under">
        <Background />
      </div>
    </div>
  )
}
