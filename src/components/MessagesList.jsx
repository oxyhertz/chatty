import React from 'react'
import { MessagePreview } from './MessagePreview'
export const MessagesList = ({ messages }) => {
  return <div>{messages?.messages?.length ? messages.messages.map((msg) => <MessagePreview msg={msg} key={msg.id} />) : ''}</div>
}
