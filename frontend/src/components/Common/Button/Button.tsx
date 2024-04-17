import React from 'react'
import "./Button.css"

type ButtonProps = {
    text: string
    action?: () => void
    bg_color: "red" | "blue" | "green"
}

function Button({text, action, bg_color}: ButtonProps) {
  return (
    <button className={'button' + ` ${bg_color}`} onClick={()=> action && action()}>{text}</button>
  )
}

export default Button