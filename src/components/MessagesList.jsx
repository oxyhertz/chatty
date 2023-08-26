import React from 'react'
import { MessagePreview } from './MessagePreview'
export const MessagesList = ({ messages }) => {
  return <div className="msg-list">{messages?.length ? messages.map((msg) => <MessagePreview msg={msg} key={msg.id} />) : ''}</div>
}
