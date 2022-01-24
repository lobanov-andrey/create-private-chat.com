import React from 'react'
import './chat.sass'

import Spinner from '../Spinner/Spinner'
import Background from '../Background/Background'
import HeadOfPage from '../HeadOfPage/HeadOfPage'
import Button from '../Button/Button'
import Message from '../Message/Message'
import Space from '../Space/Space'
import Input from '../Input/Input'
import Notice from '../Notice/Notice'
import Scroll from '../Scroll/Scroll'
// import CreatePrivateChat from '../CreatePrivateChat/CreatePrivateChat'

import FindGetParameter from '../../Utils/FindGetParameter'

import * as Types from '../../Utils/Types'

type ChatState = {
  isLoading: boolean

  topHeight: number
  bottomHeight: number

  topObserver?: any
  bottomObserver?: any
  chatObserver?: any

  textMessage: string

  messages: (Types.Message | string)[]
  messagesOrLinesOrTexts: (Types.Message | number | string)[]
}

class Chat extends React.Component<unknown, ChatState> {
  state: ChatState = {
    isLoading: false,
    topHeight: 0,
    bottomHeight: 0,
    textMessage: '',
    messages: [
      { text: 'Chat deleted by person!"', robot: true, time: Date.now() },
      'Person joined',
      { text: 'Well, yes, of course - you very rarely keep your promises.', right: true, time: Date.now() },
      { text: 'Yep, lets talk about you!', time: Date.now() },
      { text: 'Im tired', right: true, time: Date.now() },
      { text: 'Make sensenes it not easy', right: true, time: Date.now() },
      { text: 'Chat created, share link!"', robot: true, share: 'https://google.com', time: Date.now() },
      { text: 'Chat deleted by person!"', robot: true, time: Date.now() },
      'Person joined',
      { text: 'Well, yes, of course - you very rarely keep your promises.', right: true, time: Date.now() },
      { text: 'Yep, lets talk about you!', time: Date.now() },
      { text: 'Im tired', right: true, time: Date.now() },
      { text: 'Make sensenes it not easy', right: true, time: Date.now() },
      { text: 'Chat created, share link!"', robot: true, share: 'https://google.com', time: Date.now() },
    ],
    messagesOrLinesOrTexts: [],
  }

  refTop = React.createRef<HTMLDivElement>()
  refBottom = React.createRef<HTMLDivElement>()
  refChat = React.createRef<HTMLDivElement>()

  componentDidUpdate(prevProps: any, prevState: ChatState) {
    if (prevState.messages.length != this.state.messages.length) this.buildmessagesOrLinesOrTexts()
  }

  componentDidMount() {
    const id: string = FindGetParameter('id')
    console.log({ id })
    window.history.replaceState({}, document.title, '/')

    this.setHeights()
    this.setState({
      topObserver: new (window as any).ResizeObserver(this.setHeights).observe(this.refTop.current),
      bottomObserver: new (window as any).ResizeObserver(this.setHeights).observe(this.refBottom.current),
    })

    new WebSocket('ws://localhost:3030/')

    this.buildmessagesOrLinesOrTexts()
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
  }

  setHeights = () => {
    const topHeight = this.refTop.current?.clientHeight
    const bottomHeight = this.refBottom.current?.clientHeight

    this.setState({
      topHeight: topHeight ? topHeight : 0,
      bottomHeight: bottomHeight ? bottomHeight : 0,
    })
  }

  render() {
    return (
      <div ref={this.refChat} className="chat">
        <div className="chat__top">
          <Spinner isSpin={this.state.isLoading} />
          <div ref={this.refTop}>
            <HeadOfPage name="@create_private_chat_com" status="typing" />
            <Button>DELETE CHAT</Button>
          </div>
          <div
            className="chat__messages"
            style={{
              height: `calc(100% - ${this.state.topHeight + this.state.bottomHeight}px`,
            }}
          >
            <Scroll messages={this.state.messages}>
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
                  />
                )
              )}
            </Scroll>
          </div>
          <div className="chat__top__bottom" ref={this.refBottom}>
            {/* <CreatePrivateChat
              onClick={() => {
                console.log('create private chat')
              }}
            /> */}
            <Input
              value={this.state.textMessage}
              onChange={(value: string) => {
                this.setState({ textMessage: value })
              }}
              send={(text: string) => {
                this.setState({ messages: [...this.state.messages, { text, right: true, time: Date.now() }] })
              }}
            />
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
