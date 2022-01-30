import React from 'react'
import './button.sass'

type buttonProps = {
  children: React.ReactNode
  onClick: () => void
}

const Button = ({ children, onClick }: buttonProps) => {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  )
}

export default Button
