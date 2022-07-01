import React, { useEffect, useState } from 'react'
import * as Assets from '../../Utils/assets'
import getTime from '../../Utils/getTime'
import './message.sass'

const Message = ({
  text,
  time,
  corner,
  right,
  robot,
  share,
  readed,
}: {
  text: string
  time: number
  right?: boolean
  corner?: boolean
  robot?: boolean
  share?: string
  readed?: boolean
}) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timerShow = setTimeout(() => setShow(true), 0)

    return () => {
      clearTimeout(timerShow)
    }
  }, [])

  return (
    <div className={`message ${show ? 'message_active' : ''} ${right ? 'message_right' : ''}`}>
      <div className="message__limitation">
        <div className="message__top">
          {robot ? (
            <div className="message__avatar">
              <img className="message__avatar__picture" src={Assets.robotAvatar} />
            </div>
          ) : null}
          <div
            // style={{ borderRadius: right ? `9px 5px ${corner ? '0px' : '5px'} 9px` : `5px 9px 9px ${corner ? '0px' : '5px'}` }}
            style={{ borderRadius: right ? `9px 9px ${corner ? '0px' : '9px'} 9px` : `9px 9px 9px ${corner ? '0px' : '9px'}` }}
            className="message__shell"
          >
            {corner ? (
              right ? (
                <svg
                  className="message__shell__corner-right"
                  width="6"
                  height="10"
                  viewBox="0 0 6 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 0C0 3.21429 1.76471 7.67857 5.29412 8.57143C5.29412 8.57143 6 8.57143 6 9.28572C6 10 5.29412 10 5.29412 10L0 10V0Z"
                    fill="#EFFEDD"
                  />
                </svg>
              ) : (
                <svg
                  className="message__shell__corner"
                  width="6"
                  height="10"
                  viewBox="0 0 6 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 0C6 3.21429 4.23529 7.67857 0.705882 8.57143C0.705882 8.57143 0 8.57143 0 9.28572C0 10 0.705882 10 0.705882 10L6 10V0Z"
                    fill="white"
                  />
                </svg>
              )
            ) : null}
            {robot ? <div className="message__shell__name">Robot</div> : null}
            <div className="message__shell__text">{text}</div>
            <div className="message__shell__bottom">
              <div className="message__shell__bottom__time">{getTime(time)}</div>
              {right ? (
                <svg
                  className="message__shell__bottom__readed"
                  width="18"
                  height="9"
                  viewBox="0 0 18 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    style={{ transform: `translate(-${readed ? 5 : 0}px)` }}
                    d="M6.51174 4.93324C6.20893 4.65062 5.73433 4.66698 5.45171 4.96979C5.16908 5.27261 5.18545 5.7472 5.48826 6.02982L6.51174 4.93324ZM8.95486 8.2394L8.44312 8.78769C8.73127 9.05664 9.17844 9.05664 9.4666 8.78769L8.95486 8.2394ZM17.2231 1.54829C17.5259 1.26567 17.5423 0.791074 17.2596 0.488261C16.977 0.185448 16.5024 0.169083 16.1996 0.451709L17.2231 1.54829ZM5.48826 6.02982L8.44312 8.78769L9.4666 7.69111L6.51174 4.93324L5.48826 6.02982ZM9.4666 8.78769L17.2231 1.54829L16.1996 0.451709L8.44312 7.69111L9.4666 8.78769Z"
                    fill="#62AC55"
                  />
                  <path
                    d="M8.92339 8.2394L8.41165 8.78769C8.69981 9.05663 9.14698 9.05663 9.43513 8.78769L8.92339 8.2394ZM17.1916 1.54829C17.4944 1.26567 17.5108 0.791074 17.2282 0.488261C16.9456 0.185448 16.471 0.169083 16.1682 0.451709L17.1916 1.54829ZM8.51174 6.82927C8.20893 6.54665 7.73433 6.56301 7.45171 6.86583C7.16908 7.16864 7.18545 7.64323 7.48826 7.92586L8.51174 6.82927ZM9.43513 8.78769L17.1916 1.54829L16.1682 0.451709L8.41165 7.69111L9.43513 8.78769ZM9.43513 7.69111L8.51174 6.82927L7.48826 7.92586L8.41165 8.78769L9.43513 7.69111Z"
                    fill="#62AC55"
                  />
                </svg>
              ) : null}
            </div>
          </div>
        </div>
        {share ? (
          <div className="message__share">
            <button
              onClick={async () => {
                if (navigator.share) {
                  await navigator.share({
                    title: 'Link to private chat',
                    text: '',
                    url: share,
                  })
                } else {
                  try {
                    await navigator.clipboard.writeText(share)
                    alert('Link copied')
                  } catch (error) {
                    alert('Browser error')
                  }
                }
              }}
              className="message__share__shell"
            >
              Share{' '}
              <svg
                className="message__share__shell__icon"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.9974 7.19441V9.2429C6.9974 9.31118 7.03719 9.40678 7.19636 9.2429L10.5788 5.76046C10.6451 5.69218 10.738 5.51464 10.5788 5.35076L7.19636 1.86832C7.13004 1.80004 6.9974 1.70444 6.9974 1.86832V3.91685C6.9974 3.98513 6.9974 4.1217 6.79843 4.1217C3.11111 4.1217 2.22217 7.19441 2.22222 9.99647C2.22222 10.1108 2.36432 10.1369 2.42119 9.99647C3.5556 7.19441 5.28629 6.98959 6.79843 6.98959C6.86475 6.98957 6.9974 7.0305 6.9974 7.19441Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Message
