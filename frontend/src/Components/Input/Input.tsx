import React from 'react'
import './input.sass'

type InputProps = {
  value: string
  onChange: (value: string) => void
  send: (value: string) => void
}

type InputState = {
  textAreaHeight?: number
  textareaObserver?: any
}

class Input extends React.Component<InputProps, InputState> {
  state: InputState = {}

  refTextarea = React.createRef<HTMLTextAreaElement>()

  handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.props.onChange(event.target.value)
    this.setHeightOfTextarea()
  }

  setHeightOfTextarea = () => {
    const { current } = this.refTextarea
    if (current) {
      current.style.height = 'inherit'
      current.style.height = `${current.scrollHeight}px`
    }
  }

  send = () => {
    const { value } = this.props
    if (value) {
      this.props.send(value)
      this.props.onChange('')
      const { current } = this.refTextarea
      if (current) {
        current.style.height = 'inherit'
        setTimeout(() => {
          current.style.height = `${current.scrollHeight}px`
        }, 0)
      }
    }
  }

  render() {
    const { value } = this.props
    return (
      <div className="input">
        <div className="input__textarea-shell">
          {value ? null : <div className="input__textarea-shell__cursor"></div>}
          <textarea
            ref={this.refTextarea}
            style={{ caretColor: value ? '#5EA7DE' : 'transparent' }}
            placeholder="Message"
            className="input__textarea-shell__textarea"
            onChange={this.handleChange}
            value={value}
            rows={1}
            onClick={(event: any) => {
              // React.MouseEvent<HTMLTextAreaElement>
              const rect = event.target.getBoundingClientRect()

              const widthTextarea = event.target.clientWidth
              const offsetLeft = event.clientX - rect.left
              const sendMessage = widthTextarea - offsetLeft < 40

              if (sendMessage) this.send()
            }}
          />
          <div className={`input__textarea-shell__send ${value ? 'input__textarea-shell__send_active' : ''}`}>
            <svg
              className="input__textarea-shell__send__icon"
              width="27"
              height="27"
              viewBox="0 0 27 27"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.0016 3.98437C3.0016 3.65625 3.0016 3.00001 4.16548 3C5.6619 2.99998 22.2888 11.5313 23.4527 12.5156C24.3838 13.3031 23.9499 14.1562 23.4511 14.4844C22.2875 15.4685 5.50289 23.9949 4.16388 24C3 24 3 23.3438 3 23.0156L4.16505 15.7969C4.29771 15.0094 4.66401 14.8125 4.83057 14.8125L14.8067 13.8281C14.9175 13.8281 15.1392 13.7625 15.1392 13.5C15.1392 13.2375 14.9175 13.1719 14.8067 13.1719L4.83057 12.1875C4.66401 12.1875 4.29771 11.9906 4.16505 11.2031C3.77561 8.82365 3.0016 4.3125 3.0016 3.98437Z"
                fill="#5EA7DE"
              />
            </svg>
          </div>
        </div>
      </div>
    )
  }
}

export default Input
