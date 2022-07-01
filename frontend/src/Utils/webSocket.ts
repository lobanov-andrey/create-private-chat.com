import { io, Socket } from 'socket.io-client'
import { ClientToServerEvents, ServerToClientEvents } from '../../../Utils/webSocketInterfaces'
import { getZustand } from './zustand'

const webSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:5000', {
  transports: ['websocket'],
  rejectUnauthorized: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 15,
})

webSocket.on('connect', () => {
  getZustand().updateWSConnected(true)
})

webSocket.on('connect_error', () => {
  // TODO show ui
})

webSocket.on('disconnect', () => {
  getZustand().updateWSConnected(false)
})

webSocket.on('newMessage', message => {
  getZustand().addMessage(message)
})

webSocket.on('chatCreated', message => {
  getZustand().chatCreated(message)
})

webSocket.on('personConnected', () => {
  getZustand().personConnected()
})

webSocket.on('chatConnected', oppositeMessages => {
  getZustand().chatConnected(oppositeMessages)
})

webSocket.on('chatDoesntExist', () => {
  alert(`chat does'nt exist`)
})

webSocket.on('chatDeleted', () => {
  getZustand().deleteChat()
})

webSocket.on('changeVisibility', isOnline => {
  getZustand().updatePersonIsOnline(isOnline)
})

webSocket.on('viewedMessages', () => {
  getZustand().markAllMessagesReadedBySide('right')
})

let personTypingSettimeout: ReturnType<typeof setTimeout> | undefined
webSocket.on('personTyping', () => {
  if (personTypingSettimeout) clearTimeout(personTypingSettimeout)

  getZustand().updatePersonIsTyping(true)

  personTypingSettimeout = setTimeout(() => {
    getZustand().updatePersonIsTyping(false)
  }, 2000)
})

export default webSocket
