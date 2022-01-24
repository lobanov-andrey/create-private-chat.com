import React from 'react'
import './button.sass'

type buttonProps = {
  children: React.ReactNode
}

const Button = ({ children }: buttonProps) => {
  return <button className="button">{children}</button>
}

export default Button
