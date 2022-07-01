import React, { useCallback, useEffect, useRef } from 'react'
import './textarea.sass'

export default function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const changeHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '0px'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [])

  useEffect(() => {
    changeHeight()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const change = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (props.onChange) props.onChange(event)
    changeHeight()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <textarea rows={1} className="textarea" ref={textareaRef} {...props} onChange={change} />
}
