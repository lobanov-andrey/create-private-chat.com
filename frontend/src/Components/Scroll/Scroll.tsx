import React from 'react'
import './scroll.sass'

import * as Types from '../../Utils/Types'

type ScrollProps = {
  messages: (Types.Message | string)[]
}

type ScrollState = {
  scrollBottom: number
  scrollObserver?: any
  hiddenMessages: boolean
  isMove: boolean
  heightOfMessages: number
  isResize: boolean
  setTimeoutResize?: any
}

class Scroll extends React.Component<ScrollProps, ScrollState> {
  state: ScrollState = {
    scrollBottom: 0,
    hiddenMessages: true,
    isMove: false,
    heightOfMessages: 0,
    isResize: false,
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
          this.scrollToBottom()
        }
      }
    }
    if (prevState.heightOfMessages != this.state.heightOfMessages) {
      this.scrollTo(this.state.scrollBottom)
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
      this.setState({ scrollBottom })
    }
  }

  render() {
    const { children } = this.props
    return (
      <div
        style={{ opacity: this.state.hiddenMessages ? 0 : 1 }}
        ref={this.refScroll}
        onScroll={this.handleScroll}
        className="scroll"
      >
        {children}
      </div>
    )
  }
}

export default Scroll
