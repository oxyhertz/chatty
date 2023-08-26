import React from 'react'

export const MessagePreview = ({ msg }) => {
  return (
    <div className="msg">
      <span>{msg.text}</span>
    </div>
  )
}
