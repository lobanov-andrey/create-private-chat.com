import React from 'react'
import './head-of-page.sass'
import * as Assets from '../../Utils/Assets'
import TypingAnimation from '../TypingAnimation/TypingAnimation'

type HeadOfPageProps = {
  name: string
  status: string
}

const HeadOfPage = ({ name, status }: HeadOfPageProps) => {
  return (
    <div className="head-of-page">
      <div className="head-of-page__left">
        <img src={Assets.ilonMaskAvatar} className="head-of-page__left__avatar" />
        <div className="head-of-page__left__info">
          <div className="head-of-page__left__info__name">{name}</div>
          <div className="head-of-page__left__info__status">
            <TypingAnimation />
            {status}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeadOfPage
