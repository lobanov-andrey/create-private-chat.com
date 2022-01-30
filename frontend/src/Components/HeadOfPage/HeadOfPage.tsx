import React from 'react'
import * as Assets from '../../Utils/Assets'
import TypingAnimation from '../TypingAnimation/TypingAnimation'
import './head-of-page.sass'

type HeadOfPageProps = {
  name: string
  status: string
  personIsTyping: boolean
}

const HeadOfPage = ({ name, status, personIsTyping }: HeadOfPageProps) => {
  return (
    <div className="head-of-page">
      <div className="head-of-page__left">
        <img src={Assets.ilonMaskAvatar} className="head-of-page__left__avatar" />
        <div className="head-of-page__left__info">
          <div className="head-of-page__left__info__name">{name}</div>
          <div className="head-of-page__left__info__status">
            {personIsTyping ? <TypingAnimation /> : null}
            {status}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeadOfPage
