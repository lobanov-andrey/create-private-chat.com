import React from 'react'
import './notice.sass'

type noticeProps = {
  text: string
}

const Notice = ({ text }: noticeProps) => {
  return (
    <div className="notice">
      <div className="notice__shell">{text}</div>
    </div>
  )
}

export default Notice
