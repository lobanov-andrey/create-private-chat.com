import React from 'react'
import * as Types from '../../../../Utils/Types'
import './scroll.sass'

type ScrollProps = {
  messages: (Types.Message | string)[]
  onViewedMessages: () => void
  chatIsVisible: boolean
}

type ScrollState = {
  scrollBottom: number
  scrollObserver?: any
  hiddenMessages: boolean
  isMove: boolean
  heightOfMessages: number
  isResize: boolean
  setTimeoutResize?: any
  directionScroll: 'top' | 'bottom'
}

class Scroll extends React.Component<ScrollProps, ScrollState> {
  state: ScrollState = {
    scrollBottom: 0,
    hiddenMessages: true,
    isMove: false,
    heightOfMessages: 0,
    isResize: false,
    directionScroll: 'bottom',
  }

  refScroll = React.createRef<HTMLDivElement>()

  componentDidMount() {
    this.setState({
      scrollObserver: new (window as any).ResizeObserver(this.handleResize).observe(this.refScroll.current),
    })

    const { current } = this.refScroll
    this.scrollToBottom()
    this.setState({ hiddenMessages: false })
    current?.addEventListener('touchstart', this.touchStartHandler)
    current?.addEventListener('touchend', this.touchEndHandler)
  }

  scrollToBottom = () => {
    const { current } = this.refScroll
    const scrollHeight = current?.scrollHeight
    setTimeout(() => {
      current?.scrollTo({ top: scrollHeight })
      this.props.onViewedMessages()
    }, 0)
  }

  scrollTo = (offsetBottom: number) => {
    const { current } = this.refScroll
    const scrollHeight = current ? current?.scrollHeight : 0
    const clientHeight = current ? current?.clientHeight : 0
    const top = scrollHeight - clientHeight - offsetBottom

    setTimeout(() => {
      current?.scrollTo({ top })
    }, 0)
  }

  touchStartHandler = () => {
    this.setState({ isMove: true })
  }
  touchEndHandler = () => {
    this.setState({ isMove: false })
  }

  componentWillUnmount() {
    const { current } = this.refScroll
    current?.removeEventListener('touchstart', this.touchStartHandler)
    current?.removeEventListener('touchend', this.touchEndHandler)
  }

  componentDidUpdate(prevProps: ScrollProps, prevState: ScrollState) {
    if (prevProps.messages.length != this.props.messages.length) {
      if (this.state.isMove) {
      } else {
        if (this.state.scrollBottom < 100) {
          if (this.props.chatIsVisible) this.props.onViewedMessages()
          this.scrollToBottom()
        }
      }
    }
    if (prevState.heightOfMessages != this.state.heightOfMessages) {
      this.scrollTo(this.state.scrollBottom)
    }

    if (prevState.scrollBottom > this.state.scrollBottom) {
      if (this.state.directionScroll == 'top') this.setState({ directionScroll: 'bottom' })
    } else if (prevState.scrollBottom < this.state.scrollBottom) {
      if (this.state.directionScroll == 'bottom') this.setState({ directionScroll: 'top' })
    }
  }

  handleResize = () => {
    const { current } = this.refScroll
    const clientHeight = current ? current?.clientHeight : 0
    clearTimeout(this.state.setTimeoutResize)
    this.setState({
      heightOfMessages: clientHeight,
      isResize: true,
      setTimeoutResize: setTimeout(() => {
        this.setState({ isResize: false })
      }, 100),
    })
  }

  handleScroll = () => {
    const { current } = this.refScroll
    const scrollHeight = current ? current?.scrollHeight : 0
    const clientHeight = current ? current?.clientHeight : 0
    const scrollTop = current ? current?.scrollTop : 0
    const scrollBottom = scrollHeight - clientHeight - scrollTop
    if (!this.state.isResize) {
      if (scrollBottom == 0) this.props.onViewedMessages()
      this.setState({ scrollBottom })
    }
  }

  render() {
    const { children } = this.props
    let countOfUnreadMessages = 0
    this.props.messages.map(message => {
      if (typeof message == 'object' && !message.right && !message.readed && !message.robot) {
        countOfUnreadMessages++
      }
    })

    return (
      <>
        <div
          style={{ opacity: this.state.hiddenMessages ? 0 : 1 }}
          ref={this.refScroll}
          onScroll={this.handleScroll}
          className="scroll"
        >
          {children}
        </div>
        <div
          onClick={this.scrollToBottom}
          className={`scroll__to-bottom ${
            (this.state.directionScroll == 'bottom' && this.state.scrollBottom > 10) || countOfUnreadMessages
              ? 'scroll__to-bottom_active'
              : ''
          }`}
        >
          {countOfUnreadMessages ? <div className="scroll__to-bottom__count">{countOfUnreadMessages}</div> : null}
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
      </>
    )
  }
}

export default Scroll
