import { Server, Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import { OppositePersonMessage } from '../../Utils/Types'
import { ClientToServerEvents, ServerToClientEvents } from '../../Utils/webSocketInterfaces'

interface Person {
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
  chatID?: string
  oppositeMessages: OppositePersonMessage[]
}

let persons: Person[] = []

const SITE_URL = 'http://localhost:4000'

const webSocket = new Server<ClientToServerEvents, ServerToClientEvents>(5000)

const getPersonBySocketID = (socketID: string): Person | undefined => {
  return persons.find(person => person.socket.id == socketID)
}

const getPersonByChatID = (chatID: string): Person | undefined => {
  return persons.find(person => person.chatID == chatID)
}

const getOppositePerson = (socketID: string): Person | undefined => {
  const person = getPersonBySocketID(socketID)
  if (person) return persons.find(personLoop => personLoop.chatID == person.chatID && personLoop.socket.id != person.socket.id)
}

const changeChatIDBySocketID = (socketID: string, chatID?: string) => {
  for (let index = 0; index < persons.length; index++) {
    const person = persons[index]
    if (person.socket.id == socketID) {
      person.chatID = chatID
      break
    }
  }
}
const changeOppositeMessagesBySocketID = (socketID: string, oppositeMessages: OppositePersonMessage[]) => {
  for (let index = 0; index < persons.length; index++) {
    const person = persons[index]
    if (person.socket.id == socketID) {
      person.oppositeMessages = oppositeMessages
      break
    }
  }
}

webSocket.on('connection', socket => {
  persons.push({
    socket,
    chatID: undefined,
    oppositeMessages: [],
  })

  socket.on('createChat', () => {
    const chatID = uuidv4()
    changeChatIDBySocketID(socket.id, chatID)

    socket.emit('chatCreated', {
      type: 'robot',
      text: 'Chat created, share link to chat to your person! Messages appear when Person involve to chat',
      share: `${SITE_URL}?chatID=${chatID}`,
      time: Date.now(),
    })
  })

  socket.on('connectToChat', chatID => {
    const oppositePerson = getPersonByChatID(chatID)
    if (oppositePerson) {
      changeChatIDBySocketID(socket.id, chatID)
      oppositePerson.socket.emit('personConnected')

      socket.emit('chatConnected', oppositePerson.oppositeMessages)
      changeOppositeMessagesBySocketID(oppositePerson.socket.id, [])
    } else {
      socket.emit('chatDoesntExist')
    }
  })

  socket.on('newMessage', message => {
    const oppositePerson = getOppositePerson(socket.id)
    const oppositeMessage: OppositePersonMessage = {
      type: 'oppositePerson',
      time: message.time,
      text: message.text,
      readed: false,
    }
    if (oppositePerson) {
      oppositePerson.socket.emit('newMessage', oppositeMessage)
    } else {
      const person = getPersonBySocketID(socket.id)
      if (person) changeOppositeMessagesBySocketID(socket.id, [...person.oppositeMessages, oppositeMessage])
    }
  })

  socket.on('deleteChat', () => {
    const oppositePerson = getOppositePerson(socket.id)
    if (oppositePerson) {
      oppositePerson.socket.emit('chatDeleted')
      changeChatIDBySocketID(oppositePerson.socket.id)
    }
    changeChatIDBySocketID(socket.id)
  })

  socket.on('personTyping', () => {
    const oppositePerson = getOppositePerson(socket.id)
    if (oppositePerson) oppositePerson.socket.emit('personTyping')
  })

  socket.on('changeVisibility', visibility => {
    const oppositePerson = getOppositePerson(socket.id)
    if (oppositePerson) oppositePerson.socket.emit('changeVisibility', visibility)
  })

  socket.on('viewedMessages', () => {
    const oppositePerson = getOppositePerson(socket.id)
    if (oppositePerson) oppositePerson.socket.emit('viewedMessages')
  })

  socket.on('disconnect', () => {
    persons = persons.filter(personLoop => personLoop.socket.id != socket.id)

    const oppositePerson = getOppositePerson(socket.id)
    if (oppositePerson) {
      oppositePerson.socket.emit('chatDeleted')
      changeChatIDBySocketID(oppositePerson.socket.id)
    }
  })
})
