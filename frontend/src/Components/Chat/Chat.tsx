import React from 'react'
import * as Types from '../../../../Utils/Types'
import * as Config from '../../Utils/Config'
import FindGetParameter from '../../Utils/FindGetParameter'
import Background from '../Background/Background'
import Button from '../Button/Button'
import CreatePrivateChat from '../CreatePrivateChat/CreatePrivateChat'
import HeadOfPage from '../HeadOfPage/HeadOfPage'
import Input from '../Input/Input'
import Message from '../Message/Message'
import Notice from '../Notice/Notice'
import Scroll from '../Scroll/Scroll'
import Space from '../Space/Space'
import Spinner from '../Spinner/Spinner'
import './chat.sass'

class Chat extends React.Component<unknown, Types.ChatState> {
  initialState = {
    urlBackend: '',
    topHeight: 0,
    bottomHeight: 0,
    textMessage: '',
    WSconnect: false,
    isConnectedToPerson: false,
    personIsOnline: false,
    chatID: undefined,
    personIsTyping: false,
    chatIsVisible: true,
    messages: [
      // { text: 'Chat deleted by person!"', robot: true, time: Date.now() },
      // 'Person joined',
      // { text: 'Well, yes, of course - you very rarely keep your promises.', right: true, time: Date.now() },
      // { text: 'Yep, lets talk about you!', time: Date.now() },
      // { text: 'Im tired', right: true, time: Date.now() },
      // { text: 'Make sensenes it not easy', right: true, time: Date.now() },
      // { text: 'Chat created, share link!"', robot: true, share: 'https://google.com', time: Date.now() },
      // { text: 'Chat deleted by person!"', robot: true, time: Date.now() },
      // 'Person joined',
      // { text: 'Well, yes, of course - you very rarely keep your promises.', right: true, time: Date.now() },
      // { text: 'Yep, lets talk about you!', time: Date.now() },
      // { text: 'Im tired', right: true, time: Date.now() },
      // { text: 'Make sensenes it not easy', right: true, time: Date.now() },
      // { text: 'Chat created, share link!"', robot: true, share: 'https://google.com', time: Date.now() },
    ],
    messagesOrLinesOrTexts: [],
    createPrivateChatIsOpen: true,
    deleteChatIsOpen: false,
  }

  state: Types.ChatState = this.initialState

  wss: any

  refTop = React.createRef<HTMLDivElement>()
  refBottom = React.createRef<HTMLDivElement>()
  refChat = React.createRef<HTMLDivElement>()

  componentDidUpdate(prevProps: any, prevState: Types.ChatState) {
    if (JSON.stringify(prevState.messages) != JSON.stringify(this.state.messages)) this.buildmessagesOrLinesOrTexts()
    if (!prevState.chatID && this.state.chatID) this.pushSearch(`/?id=${this.state.chatID}`)
    if (prevState.chatID && !this.state.chatID) this.pushSearch(`/`)
    if (!prevState.isConnectedToPerson && this.state.isConnectedToPerson) this.sendStatusVisibility(this.state.chatIsVisible)
  }

  componentDidMount() {
    this.setHeights()
    this.setState({
      topObserver: new (window as any).ResizeObserver(this.setHeights).observe(this.refTop.current),
      bottomObserver: new (window as any).ResizeObserver(this.setHeights).observe(this.refBottom.current),
    })
    document.addEventListener('visibilitychange', this.visibilityChangeCallback)
    this.connectToServer()
  }

  checkID = () => {
    const chatID: string = FindGetParameter('id')

    if (chatID && chatID != '') {
      const dataForServer: Types.DataFromClient = {
        type: 'SET_CHATID',
        chatID: chatID,
      }
      this.wss.send(JSON.stringify(dataForServer))
    }

    // window.history.replaceState({}, document.title, '/')
    // window.history.replaceState({}, document.title, '/?id=1111')
  }

  pushSearch = (search: string, title?: string) => {
    window.history.replaceState({}, title ? title : document.title, search)
  }

  connectToServer = () => {
    this.setState(this.initialState)
    this.wss = new WebSocket(Config.PRODUCTION_MODE ? Config.WS_URL : 'ws://localhost:4551')

    this.wss.onopen = this.WSonOpen
    this.wss.onmessage = this.WSonMessage
    this.wss.onerror = this.WSonError
    this.wss.onclose = this.WSonClose
  }

  WSonOpen = () => {
    console.log('websocket open')
    this.setState({ WSconnect: true })
    // this.sendMessage('chat open')
    this.checkID()
  }
  WSonMessage = (event: any) => {
    const data: Types.DataFromServer = JSON.parse(event.data)
    switch (data.type) {
      case 'NEW_MESSAGE': {
        if (data.message) this.newMessage(data.message)
        break
      }
      case 'SET_STATE': {
        const state: Types.SetClientChatStateFromServer = data.state ? data.state : {}
        this.setState({ ...this.state, ...state })
        break
      }
      case 'SEND_TEXT': {
        if (data.text) this.newText(data.text)
        break
      }
      case 'DELETE_CHAT': {
        this.setState({
          ...this.initialState,
          WSconnect: true,
          createPrivateChatIsOpen: true,
          messages: [{ text: 'Chat deleted by person', time: Date.now(), robot: true, readed: false }],
        })
        break
      }
      case 'PERSON_TYPING': {
        clearTimeout(this.state.personTypingSettimeout)
        this.setState({
          personTypingSettimeout: setTimeout(() => {
            this.setState({ personIsTyping: false })
          }, 2000),
          personIsTyping: true,
        })
        break
      }
      case 'CHANGE_VISIBILITY': {
        const value = data.value
        this.setState({
          personIsOnline: value,
        })
        break
      }
      case 'VIEWED_MESSAGES': {
        this.markAllMessagesReadedBySide('right')
        break
      }

      default: {
        break
      }
    }
  }

  markAllMessagesReadedBySide = (side: 'left' | 'right') => {
    const copyMessages: (Types.Message | string)[] = []
    this.state.messages.map(message => {
      if (typeof message == 'string') {
        copyMessages.push(message)
      } else if (typeof message == 'object') {
        if (side == 'left') {
          if (!message.right) {
            const copyMessage = { ...message, readed: true }
            copyMessages.push(copyMessage)
          } else {
            copyMessages.push(message)
          }
        } else {
          if (message.right) {
            const copyMessage = { ...message, readed: true }
            copyMessages.push(copyMessage)
          } else {
            copyMessages.push(message)
          }
        }
      }
    })
    this.setState({ messages: copyMessages })
  }

  WSonError = () => {
    console.log('websocket error')
  }
  WSonClose = () => {
    console.log('websocket close')
    this.setState({ WSconnect: false })
    setTimeout(() => {
      this.connectToServer()
    }, 1000)
  }

  newMessage = (message: Types.Message) => {
    this.setState({ messages: [...this.state.messages, message] })
  }
  newText = (text: string) => {
    this.setState({ messages: [...this.state.messages, text] })
  }

  sendMessage = (text: string) => {
    const dataForServer: Types.DataFromServer = {
      type: 'NEW_MESSAGE',
      message: {
        text,
        time: Date.now(),
        readed: false,
      },
    }
    this.wss.send(JSON.stringify(dataForServer))
  }

  buildmessagesOrLinesOrTexts = () => {
    const copyMessages = [...this.state.messages]
    const messagesOrLinesOrTexts: (Types.Message | number | string)[] = []

    copyMessages.map((message: Types.Message | string, index: number) => {
      messagesOrLinesOrTexts.push(message)

      if (typeof message == 'string') {
        messagesOrLinesOrTexts.push(12)
      } else {
        const nextMessage: Types.Message | undefined | string = copyMessages[index + 1]

        if (typeof nextMessage == 'string') {
          messagesOrLinesOrTexts.push(12)
          // message.corner = true
        } else if (typeof nextMessage == 'undefined') {
          // message.corner = true
        } else {
          if (message.right) {
            if (nextMessage.right) {
              messagesOrLinesOrTexts.push(4)
            }
            if (!nextMessage.right) {
              messagesOrLinesOrTexts.push(8)
              // message.corner = true
            }
          } else {
            if (nextMessage.right) {
              messagesOrLinesOrTexts.push(8)
              // message.corner = true
            }
            if (!nextMessage.right) {
              messagesOrLinesOrTexts.push(4)
            }
          }
          if (message.robot) {
            messagesOrLinesOrTexts.push(8)
          }
        }
      }
    })
    this.setState({
      messagesOrLinesOrTexts,
    })
  }

  componentWillUnmount() {
    if (this.state.topObserver) this.state.topObserver.disconnect()
    if (this.state.bottomObserver) this.state.bottomObserver.disconnect()
    document.removeEventListener('visibilitychange', this.visibilityChangeCallback)
  }

  sendStatusVisibility = (value: boolean) => {
    try {
      const dataForServer: Types.DataFromClient = {
        type: 'CHANGE_VISIBILITY',
        value,
      }
      this.wss.send(JSON.stringify(dataForServer))
    } catch (error) {
      console.error(error)
    }
  }

  visibilityChangeCallback = () => {
    if (document.visibilityState === 'visible') {
      this.sendStatusVisibility(true)
      this.setState({ chatIsVisible: true })
      this.onViewedMessages()
    } else {
      this.sendStatusVisibility(false)
      this.setState({ chatIsVisible: false })
    }
  }

  setHeights = () => {
    const topHeight = this.refTop.current?.clientHeight
    const bottomHeight = this.refBottom.current?.clientHeight

    this.setState({
      topHeight: topHeight ? topHeight : 0,
      bottomHeight: bottomHeight ? bottomHeight : 0,
    })
  }

  getStatus = (): string => {
    if (this.state.WSconnect) {
      if (this.state.isConnectedToPerson) {
        if (this.state.personIsTyping) {
          return 'typing'
        } else {
          if (this.state.personIsOnline) {
            return 'online'
          } else {
            return 'offline'
          }
        }
      } else {
        return 'online'
      }
    } else {
      return 'offline'
    }
  }

  onCreatePrivateChat = () => {
    try {
      const dataForServer: Types.DataFromClient = {
        type: 'CREATE_PRIVATE_CHAT',
      }
      this.wss.send(JSON.stringify(dataForServer))
    } catch (error) {
      console.error(error)
    }
  }

  onDeleteChat = async () => {
    const dataForServer: Types.DataFromClient = {
      type: 'DELETE_CHAT',
    }
    this.wss.send(JSON.stringify(dataForServer))
    this.setState({ ...this.initialState })
    this.setState({ WSconnect: true, createPrivateChatIsOpen: true })
  }

  onViewedMessages = () => {
    const dataForServer: Types.DataFromClient = {
      type: 'VIEWED_MESSAGES',
    }
    this.wss.send(JSON.stringify(dataForServer))
    this.markAllMessagesReadedBySide('left')
  }

  render() {
    return (
      <div ref={this.refChat} className="chat">
        <div className="chat__top">
          <Spinner isSpin={!this.state.WSconnect} />
          <div className="chat__top__head" ref={this.refTop}>
            <HeadOfPage
              personIsTyping={this.state.personIsTyping}
              name={this.state.isConnectedToPerson ? 'Person' : '@create_private_chat_com'}
              status={this.getStatus()}
            />
            {this.state.deleteChatIsOpen ? <Button onClick={this.onDeleteChat}>DELETE CHAT</Button> : null}
          </div>
          <div
            className="chat__messages"
            style={{
              height: `calc(100% - ${this.state.topHeight + this.state.bottomHeight}px`,
            }}
          >
            <Scroll
              chatIsVisible={this.state.chatIsVisible}
              onViewedMessages={this.onViewedMessages}
              messages={this.state.messages}
            >
              {this.state.messagesOrLinesOrTexts.map((messageOrLineOrText, index) =>
                typeof messageOrLineOrText == 'number' ? (
                  <Space key={index} height={messageOrLineOrText} />
                ) : typeof messageOrLineOrText == 'string' ? (
                  <Notice key={index} text="Person joined" />
                ) : (
                  <Message
                    key={index}
                    right={messageOrLineOrText.right}
                    robot={messageOrLineOrText.robot}
                    text={messageOrLineOrText.text}
                    time={messageOrLineOrText.time}
                    corner={messageOrLineOrText.corner}
                    share={messageOrLineOrText.share}
                    readed={messageOrLineOrText.readed}
                  />
                )
              )}
            </Scroll>
          </div>
          <div className="chat__top__bottom" ref={this.refBottom}>
            {this.state.WSconnect && this.state.createPrivateChatIsOpen ? (
              <CreatePrivateChat
                onClick={() => {
                  this.onCreatePrivateChat()
                }}
              />
            ) : null}
            {this.state.WSconnect && this.state.isConnectedToPerson ? (
              <Input
                value={this.state.textMessage}
                onChange={(value: string) => {
                  this.setState({ textMessage: value })

                  const dataForServer: Types.DataFromClient = {
                    type: 'PERSON_TYPING',
                  }
                  this.wss.send(JSON.stringify(dataForServer))
                }}
                send={(text: string) => {
                  this.setState({ messages: [...this.state.messages, { text, right: true, time: Date.now(), readed: false }] })
                  this.sendMessage(text)
                }}
              />
            ) : null}
          </div>
        </div>
        <div className="chat__bottom">
          <Background />
        </div>
      </div>
    )
  }
}

export default Chat
