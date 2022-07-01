import { OppositePersonMessage, PersonMessage, RobotMessage } from './Types'

export interface ServerToClientEvents {
  newMessage: (message: OppositePersonMessage | RobotMessage) => void
  chatDeleted: () => void
  personTyping: () => void
  changeVisibility: (visibility: boolean) => void
  viewedMessages: () => void
  personConnected: () => void
  chatConnected: (oppositeMessages: OppositePersonMessage[]) => void
  chatDoesntExist: () => void
  chatCreated: (message: RobotMessage) => void
}

export interface ClientToServerEvents {
  viewedMessages: () => void
  newMessage: (message: PersonMessage) => void
  createChat: () => void
  connectToChat: (chatID: string) => void
  deleteChat: () => void
  personTyping: () => void
  changeVisibility: (visibility: boolean) => void
}

export interface InterServerEvents {
  ping: () => void
}

export interface SocketData {
  chatID: string
}
