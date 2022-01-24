import React from 'react'
import './create-private-chat.sass'

type CreatePrivateChatProps = {
  onClick: () => void
}

const CreatePrivateChat = ({ onClick }: CreatePrivateChatProps) => (
  <button onClick={onClick} className="create-private-chat">
    create private chat
  </button>
)

export default CreatePrivateChat
