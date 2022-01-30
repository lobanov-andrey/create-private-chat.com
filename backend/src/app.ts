import WebSocket from 'ws'
import * as Types from '../../Utils/Types'

require('dotenv').config()

interface ProcessENVType {
  PORT: number
  SITE_URL: string
}

const processENV: ProcessENVType = {
  PORT: Number(process.env.PORT),
  SITE_URL: process.env.SITE_URL,
}

const { PORT, SITE_URL } = processENV
if (!PORT) throw 'PORT not found in .env'
if (!SITE_URL) throw 'SITE_URL not found in .env'

let wss = new WebSocket.Server({ port: PORT })
let persons = []

wss.sendMessageByID = (ID: string, dataFromServer: Types.DataFromServer) => {
  const person = persons.find(p => p.ID == ID)
  if (person) person.ws.send(JSON.stringify(dataFromServer))
  else console.log('not found person for send message!')
}

wss.on('connection', function connection(ws: any) {
  console.log('client connected')

  let ID = `${Date.now()}`

  const person: Types.Person = {
    ws,
    ID,
    chatID: null,
  }

  const getAnotherPerson = (): Types.Person | null => {
    const personsByChatID: Types.Person[] = persons.filter(p => p.chatID == person.chatID && p.ID != person.ID)

    if (personsByChatID.length == 1) {
      return personsByChatID[0]
    } else {
      return null
    }
  }

  persons = [...persons, person]

  person.ws.onmessage = (event: WebSocket) => {
    const data: Types.DataFromClient = JSON.parse(event.data)
    switch (data.type) {
      case 'CREATE_PRIVATE_CHAT': {
        const chatID = `${Date.now()}`
        person.chatID = chatID

        wss.sendMessageByID(person.ID, {
          type: 'NEW_MESSAGE',
          message: {
            text: 'Chat created, share link to chat to your person! Messages appear when Person involve to chat',
            robot: true,
            share: `${SITE_URL}?id=${chatID}`,
            time: Date.now(),
            readed: true,
          },
        })

        wss.sendMessageByID(person.ID, {
          type: 'SET_STATE',
          state: { createPrivateChatIsOpen: false, deleteChatIsOpen: true, chatID: chatID },
        })
        break
      }
      case 'SET_CHATID': {
        try {
          const chatID = data.chatID
          const personsByChatID: Types.Person[] = persons.filter(p => p.chatID == chatID)

          if (personsByChatID.length == 1) {
            const anotherPerson: Types.Person = personsByChatID[0]

            person.chatID = chatID
            anotherPerson.chatID = chatID
            wss.sendMessageByID(anotherPerson.ID, {
              type: 'SEND_TEXT',
              text: 'Person joined',
            })
            wss.sendMessageByID(anotherPerson.ID, {
              type: 'SET_STATE',
              state: { isConnectedToPerson: true, personIsOnline: true },
            })
            wss.sendMessageByID(person.ID, {
              type: 'SET_STATE',
              state: {
                isConnectedToPerson: true,
                personIsOnline: true,
                deleteChatIsOpen: true,
                createPrivateChatIsOpen: false,
              },
            })
          } else {
            console.log('another person not found by set chatid')
          }
        } catch (error) {
          console.error(error)
        }
      }
      case 'NEW_MESSAGE': {
        const { message } = data
        const anotherPerson: Types.Person = getAnotherPerson()
        if (anotherPerson) {
          wss.sendMessageByID(anotherPerson.ID, {
            type: 'NEW_MESSAGE',
            message,
          })
        } else {
          console.log('another person not found by new message')
        }

        break
      }
      case 'DELETE_CHAT': {
        try {
          const anotherPerson: Types.Person = getAnotherPerson()
          if (anotherPerson) {
            wss.sendMessageByID(anotherPerson.ID, {
              type: 'DELETE_CHAT',
            })
            anotherPerson.chatID = null
          } else {
            console.log('another person not found by delete chat')
          }
          person.chatID = null
        } catch (error) {
          console.error(error)

          break
        }
      }
      case 'PERSON_TYPING': {
        try {
          const anotherPerson: Types.Person = getAnotherPerson()
          if (anotherPerson) {
            wss.sendMessageByID(anotherPerson.ID, {
              type: 'PERSON_TYPING',
            })
          } else {
            console.log('another person not found person typing')
          }
        } catch (error) {
          console.error(error)
          break
        }
      }
      case 'CHANGE_VISIBILITY': {
        try {
          const value = data.value
          const anotherPerson: Types.Person = getAnotherPerson()
          if (anotherPerson) {
            wss.sendMessageByID(anotherPerson.ID, {
              type: 'CHANGE_VISIBILITY',
              value,
            })
          } else {
            console.log('another person not found changet vidibilyty')
          }
        } catch (error) {
          console.error(error)
          break
        }
      }
      case 'VIEWED_MESSAGES': {
        try {
          const anotherPerson: Types.Person = getAnotherPerson()
          if (anotherPerson) {
            wss.sendMessageByID(anotherPerson.ID, {
              type: 'VIEWED_MESSAGES',
            })
          } else {
            console.log('another person not found messages viewed')
          }
        } catch (error) {
          console.error(error)
          break
        }
      }
      default: {
        break
      }
    }
  }

  person.ws.onclose = () => {
    persons = persons.filter(p => p.ID != person.ID)

    const anotherPerson: Types.Person = getAnotherPerson()
    if (anotherPerson) {
      wss.sendMessageByID(anotherPerson.ID, {
        type: 'DELETE_CHAT',
      })
      anotherPerson.chatID = null
    } else {
      console.log('another person not found by client disconnected')
    }

    console.log('client disconnected')
  }
})
