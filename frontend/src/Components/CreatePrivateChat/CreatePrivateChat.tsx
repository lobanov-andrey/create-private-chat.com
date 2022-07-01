import React from 'react'
import HeadOfPage from '../HeadOfPage/HeadOfPage'
import './create-private-chat.sass'

type CreatePrivateChatProps = {
  onClick: () => void
}

const CreatePrivateChat = ({ onClick }: CreatePrivateChatProps) => (
  <div className="create-private-chat">
    <HeadOfPage name={'Moment chat'} status={'Online'} />

    <button onClick={onClick} className="create-private-chat__action">
      create private chat
    </button>
  </div>
)

export default CreatePrivateChat
