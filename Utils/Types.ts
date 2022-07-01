export type OppositePersonMessage = {
  type: 'oppositePerson'
  text: string
  time: number
  readed: boolean
}
export type PersonMessage = {
  type: 'person'
  text: string
  time: number
  readed: boolean
}

export type RobotMessage = {
  type: 'robot'
  text: string
  time: number
  share?: string
}

export type NoticeMessage = {
  type: 'notice'
  text: string
}

export type MessageTypes = OppositePersonMessage | NoticeMessage | RobotMessage | PersonMessage
