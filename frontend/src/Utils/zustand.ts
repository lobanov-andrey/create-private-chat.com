import immer from 'immer'
import zustand from 'zustand'
import { MessageTypes, OppositePersonMessage, RobotMessage } from '../../../Utils/Types'
import { ScrollPosition } from '../Components/Scroll/Scroll'
import webSocket from './webSocket'

interface Chat {
  messages: MessageTypes[]
  personIsTyping: boolean
  personIsOnline: boolean
  scrollPosition: ScrollPosition
}

interface zustandStore {
  chat: Chat | undefined
  addMessage: (message: MessageTypes) => void
  chatCreated: (message: RobotMessage) => void
  personConnected: () => void
  chatConnected: (oppositeMessages: OppositePersonMessage[]) => void
  markAllMessagesReadedBySide: (side: 'left' | 'right') => void
  updatePersonIsTyping: (personIsTyping: boolean) => void
  updatePersonIsOnline: (personIsOnline: boolean) => void
  changeScrollPosition: (position: ScrollPosition) => void
  deleteChat: () => void

  WSIsConnected: boolean
  updateWSConnected: (connected: boolean) => void

  visibility: boolean
  updateVisibility: (visibility: boolean) => void
}

const useZustand = zustand<zustandStore>((set, get) => ({
  chat: undefined,
  addMessage: message =>
    set(
      immer<zustandStore>(state => {
        const { chat, visibility } = get()
        if (visibility && chat && chat.scrollPosition == 'bottom' && message.type == 'oppositePerson') {
          webSocket.emit('viewedMessages')
          message.readed = true
        }
        if (state.chat) state.chat.messages = [...state.chat.messages, message]
      })
    ),
  chatCreated: message =>
    set(
      immer<zustandStore>(state => {
        state.chat = {
          messages: [message],
          personIsTyping: false,
          personIsOnline: false,
          scrollPosition: 'bottom',
        }
      })
    ),
  chatConnected: oppositeMessages =>
    set(
      immer<zustandStore>(state => {
        state.chat = {
          messages: [...oppositeMessages],
          personIsTyping: false,
          personIsOnline: true,
          scrollPosition: 'bottom',
        }
      })
    ),
  personConnected: () =>
    set(
      immer<zustandStore>(state => {
        if (state.chat) {
          state.chat = {
            messages: [...state.chat.messages, { type: 'notice', text: 'Person joined' }],
            personIsTyping: false,
            personIsOnline: true,
            scrollPosition: 'bottom',
          }
        }
      })
    ),
  markAllMessagesReadedBySide: side =>
    set(
      immer<zustandStore>(state => {
        if (state.chat) {
          state.chat.messages = state.chat.messages.map(message => {
            if (side == 'left') {
              if (message.type == 'oppositePerson') {
                return {
                  ...message,
                  readed: true,
                }
              }
            }
            if (side == 'right') {
              if (message.type == 'person') {
                return {
                  ...message,
                  readed: true,
                }
              }
            }
            return message
          })
        }
      })
    ),
  updatePersonIsTyping: personIsTyping =>
    set(
      immer<zustandStore>(state => {
        if (state.chat) state.chat.personIsTyping = personIsTyping
      })
    ),
  updatePersonIsOnline: personIsOnline =>
    set(
      immer<zustandStore>(state => {
        if (state.chat) state.chat.personIsOnline = personIsOnline
      })
    ),
  changeScrollPosition: scrollPosition =>
    set(
      immer<zustandStore>(state => {
        if (state.chat) {
          console.log(`changeScrollPosition ${scrollPosition}`)

          if (scrollPosition == 'bottom') {
            webSocket.emit('viewedMessages')
            state.chat.messages = state.chat.messages.map(message => {
              if (message.type == 'oppositePerson') return { ...message, readed: true }
              return message
            })
          }
          state.chat.scrollPosition = scrollPosition
        }
      })
    ),
  deleteChat: () =>
    set(
      immer<zustandStore>(state => {
        state.chat = undefined
      })
    ),

  WSIsConnected: false,
  updateWSConnected: connected => {
    set({ WSIsConnected: connected })
  },

  visibility: true,
  updateVisibility: visibility => {
    webSocket.emit('changeVisibility', visibility)
    set({ visibility })
    const { chat } = get()
    if (visibility && chat && chat.scrollPosition == 'bottom') {
      webSocket.emit('viewedMessages')
      getZustand().markAllMessagesReadedBySide('left')
    }
  },
}))

export const { getState: getZustand } = useZustand

document.addEventListener('visibilitychange', () => {
  getZustand().updateVisibility(document.visibilityState === 'visible')
})

export default useZustand
