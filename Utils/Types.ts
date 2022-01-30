type Message = {
  text: string
  time: number
  readed: boolean
  right?: true
  robot?: true
  share?: string
  corner?: true
}

type SetClientChatStateFromServer = {
  isConnectedToPerson?: boolean
  personIsOnline?: boolean
  createPrivateChatIsOpen?: boolean
  deleteChatIsOpen?: boolean
  chatID?: string
}

type ChatState = SetClientChatStateFromServer & {
  urlBackend: string

  topHeight: number
  bottomHeight: number

  topObserver?: any
  bottomObserver?: any
  chatObserver?: any

  chatIsVisible: boolean

  personIsTyping: boolean
  personTypingSettimeout?: any

  messages: (Message | string)[]

  textMessage: string

  WSconnect: boolean

  messagesOrLinesOrTexts: (Message | number | string)[]
}

type ChatID = string

type Person = {
  ws: any
  ID: string
  chatID?: ChatID
}

type DataFromServer = {
  type: 'NEW_MESSAGE' | 'SET_STATE' | 'SEND_TEXT' | 'DELETE_CHAT' | 'PERSON_TYPING' | 'CHANGE_VISIBILITY' | 'VIEWED_MESSAGES'
  message?: Message
  state?: SetClientChatStateFromServer
  text?: string
  value?: boolean
}

type DataFromClient = {
  type:
    | 'VIEWED_MESSAGES'
    | 'NEW_MESSAGE'
    | 'CREATE_PRIVATE_CHAT'
    | 'SET_CHATID'
    | 'HIDE_SITE'
    | 'OPEN_SITE'
    | 'DELETE_CHAT'
    | 'PERSON_TYPING'
    | 'CHANGE_VISIBILITY'
  chatID?: ChatID
  message?: Message
  value?: boolean
}

export { Message, DataFromServer, DataFromClient, ChatState, Person, SetClientChatStateFromServer }
