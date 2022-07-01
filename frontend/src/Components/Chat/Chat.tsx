import React, { useEffect, useState } from 'react'
import { MessageTypes, PersonMessage } from '../../../../Utils/Types'
import findGetParameter from '../../Utils/findGetParameter'
import pushSearch from '../../Utils/pushSearch'
import webSocket from '../../Utils/webSocket'
import useZustand, { getZustand } from '../../Utils/zustand'
import Button from '../Button/Button'
import CreatePrivateChat from '../CreatePrivateChat/CreatePrivateChat'
import HeadOfPage from '../HeadOfPage/HeadOfPage'
import Input from '../Input/Input'
import Message from '../Message/Message'
import Notice from '../Notice/Notice'
import Resize from '../Resize/Resize'
import Scroll, { ScrollPosition } from '../Scroll/Scroll'
import Space from '../Space/Space'
import Spinner from '../Spinner/Spinner'
import './chat.sass'

export default function Chat() {
  const { WSIsConnected, chat, visibility, addMessage } = useZustand()

  const [topHeight, setTopHeight] = useState(0)
  const [bottomHeight, setBottomHeight] = useState(0)

  useEffect(() => {
    const chatID = findGetParameter('chatID')
    if (chatID) {
      pushSearch()
      webSocket.emit('connectToChat', chatID)
    }
  }, [])

  const sendMessage = (text: string) => {
    const newPersonMessage: PersonMessage = { type: 'person', text, time: Date.now(), readed: false }
    addMessage(newPersonMessage)
    webSocket.emit('newMessage', newPersonMessage)
  }

  const getStatus = (): string => {
    if (personIsTyping) {
      return 'typing'
    } else {
      if (personIsOnline) {
        return 'online'
      } else {
        return 'offline'
      }
    }
  }

  const onCreateChat = () => {
    webSocket.emit('createChat')
  }

  const onDeleteChat = async () => {
    getZustand().deleteChat()
    webSocket.emit('deleteChat')
  }

  const changeScrollPosition = (position: ScrollPosition) => {
    getZustand().changeScrollPosition(position)
  }

  if (!WSIsConnected) return <Spinner isSpin={!WSIsConnected} />

  if (!chat)
    return (
      <CreatePrivateChat
        onClick={() => {
          onCreateChat()
        }}
      />
    )

  const { messages, personIsTyping, personIsOnline } = chat

  return (
    <div className="chat">
      <Resize onChangeHeight={height => setTopHeight(height)}>
        <div className="chat__head">
          <HeadOfPage personIsTyping={personIsTyping} name={'Person'} status={getStatus()} />
          <Button onClick={onDeleteChat}>DELETE CHAT</Button>
        </div>
      </Resize>

      <div
        className="chat__messages"
        style={{
          height: `calc(100% - ${topHeight + bottomHeight}px`,
        }}
      >
        <Scroll
          chatIsVisible={visibility}
          onChangeScrollPosition={changeScrollPosition}
          showAnchorButton={true}
          badgeOnAnchor={messages.filter(message => message.type == 'oppositePerson' && !message.readed).length}
        >
          {messages.map((message, index) => {
            let spaceHeight = 0
            const prevMessage: MessageTypes | undefined = messages[index - 1]
            if (prevMessage) {
              spaceHeight = message.type != prevMessage.type ? 12 : 4
            }
            const space = <Space key={index} height={spaceHeight} />

            if (message.type == 'notice') {
              return (
                <div key={index}>
                  {space}
                  <Notice text={message.text} />
                </div>
              )
            }
            if (message.type == 'robot') {
              return (
                <div key={index}>
                  {space}
                  <Message robot={true} text={message.text} time={message.time} share={message.share} />
                </div>
              )
            }
            if (message.type == 'oppositePerson') {
              return (
                <div key={index}>
                  {space}
                  <Message text={message.text} time={message.time} />
                </div>
              )
            }
            if (message.type == 'person') {
              return (
                <div key={index}>
                  {space}
                  <Message right={true} text={message.text} time={message.time} readed={message.readed} />
                </div>
              )
            }
          })}
        </Scroll>
      </div>

      <Resize onChangeHeight={height => setBottomHeight(height)}>
        <div className="chat__bottom">
          <Input
            onTyping={() => {
              webSocket.emit('personTyping')
            }}
            send={(text: string) => {
              sendMessage(text)
            }}
          />
        </div>
      </Resize>
    </div>
  )
}
