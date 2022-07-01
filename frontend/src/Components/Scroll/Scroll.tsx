import { ResizeObserver } from '@juggle/resize-observer'
import React, { useEffect, useRef, useState } from 'react'
import usePrevious from '../../Utils/usePrevious'
import './scroll.sass'

export type ScrollPosition = 'bottom' | 'middle' | 'top'

export default function Scroll({
  onChangeScrollPosition,
  children,
  height,
  showAnchorButton,
  badgeOnAnchor,
}: {
  onChangeScrollPosition: (position: ScrollPosition) => void
  chatIsVisible: boolean
  children: React.ReactNode
  height?: number
  showAnchorButton?: boolean
  badgeOnAnchor?: string | number
}) {
  const [scrollBottom, setScrollBottom] = useState(0)
  const previousScrollBottom = usePrevious(scrollBottom)

  const [hiddenMessages, setHiddenMessages] = useState(true)

  const [setTimeoutResize, setSetTimeoutResize] = useState<ReturnType<typeof setTimeout>>()
  const [isMove, setIsMove] = useState(false)
  const [isResize, setIsResize] = useState(false)
  const [directionScroll, setDirectionScroll] = useState<'top' | 'bottom'>('bottom')
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>('bottom')

  const refScroll = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
    setHiddenMessages(false)

    if (refScroll.current) {
      const resizeObserver: ResizeObserver = new ResizeObserver(handleResize)
      resizeObserver.observe(refScroll.current)

      refScroll.current.addEventListener('touchstart', touchStartHandler)
      refScroll.current.addEventListener('touchend', touchEndHandler)
      return () => {
        resizeObserver.disconnect()

        if (refScroll.current) {
          refScroll.current.removeEventListener('touchend', touchEndHandler)
          refScroll.current.removeEventListener('touchstart', touchStartHandler) // eslint-disable-line react-hooks/exhaustive-deps
        }
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (typeof previousScrollBottom == 'number') {
      if (previousScrollBottom > scrollBottom) {
        if (directionScroll == 'top') setDirectionScroll('bottom')
      } else if (previousScrollBottom < scrollBottom) {
        if (directionScroll == 'bottom') setDirectionScroll('top')
      }
    }
  }, [scrollBottom, directionScroll]) // eslint-disable-line react-hooks/exhaustive-deps

  const scrollToBottom = () => {
    scrollToFromBottom(0)
  }

  const scrollToFromBottom = (offsetBottom: number) => {
    setTimeout(() => {
      if (refScroll.current) {
        const { current } = refScroll
        const scrollHeight = current.scrollHeight
        const clientHeight = current.clientHeight
        const offsetFromTop = scrollHeight - clientHeight - offsetBottom

        current.scrollTo({ top: offsetFromTop })
      }
    }, 0)
  }

  const handleResize = () => {
    setIsResize(true)

    if (scrollPosition == 'bottom') scrollToBottom()

    if (setTimeoutResize) clearTimeout(setTimeoutResize)
    setSetTimeoutResize(
      setTimeout(() => {
        setIsResize(false)
      }, 100)
    )
  }

  useEffect(() => {
    if (scrollPosition == 'bottom' && !isMove) scrollToBottom()
  }, [children]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    onChangeScrollPosition(scrollPosition)
  }, [scrollPosition]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleScroll = () => {
    if (refScroll.current) {
      const { current } = refScroll
      const scrollHeight = current.scrollHeight
      const clientHeight = current.clientHeight
      const scrollTop = current.scrollTop
      const scrollBottom = scrollHeight - clientHeight - scrollTop
      if (!isResize) {
        const line = 30
        if (scrollBottom < line) {
          const position = 'bottom'
          if (scrollPosition !== position) setScrollPosition(position)
        } else if (scrollTop < line) {
          const position = 'top'
          if (scrollPosition !== position) setScrollPosition(position)
        } else {
          const position = 'middle'
          if (scrollPosition !== position) setScrollPosition(position)
        }

        setScrollBottom(scrollBottom)
      }
    }
  }

  const touchStartHandler = () => {
    setIsMove(true)
  }
  const touchEndHandler = () => {
    setIsMove(false)
  }

  return (
    <>
      <div style={typeof height == 'number' ? { height } : {}} className="scroll">
        <div style={{ opacity: hiddenMessages ? 0 : 1 }} className="scroll__vertical" ref={refScroll} onScroll={handleScroll}>
          {children}
        </div>
        {showAnchorButton ? (
          <div
            onClick={scrollToBottom}
            className={`scroll__to-bottom ${
              (directionScroll == 'bottom' && scrollBottom > 10) || badgeOnAnchor ? 'scroll__to-bottom_active' : ''
            }`}
          >
            {badgeOnAnchor ? <div className="scroll__to-bottom__count">{badgeOnAnchor}</div> : null}
            <svg
              className="scroll__to-bottom__icon"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.4697 6.46967C18.7626 6.17678 19.2374 6.17678 19.5303 6.46967C19.8232 6.76256 19.8232 7.23743 19.5303 7.53033L18.4697 6.46967ZM11 15L11.5304 15.5303C11.2375 15.8232 10.7626 15.8232 10.4697 15.5303L11 15ZM2.46967 7.53033C2.17678 7.23744 2.17678 6.76257 2.46967 6.46967C2.76256 6.17678 3.23743 6.17678 3.53033 6.46967L2.46967 7.53033ZM19.5303 7.53033L11.5304 15.5303L10.4697 14.4697L18.4697 6.46967L19.5303 7.53033ZM3.53033 6.46967L11.5304 14.4697L10.4697 15.5303L2.46967 7.53033L3.53033 6.46967Z"
                fill="#868686"
              />
            </svg>
          </div>
        ) : null}
      </div>
    </>
  )
}
