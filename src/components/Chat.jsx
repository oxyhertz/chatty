import React, { useContext, useEffect, useState } from 'react'
import { MessagesList } from './MessagesList'
import { ChatContext } from '../context/ChatContext'
import { getConvMsgs } from '../services/firebase'
import { SendMsgInput } from './SendMsgInput'
export const Chat = () => {
  const [messages, setMessages] = useState([])
  const { data } = useContext(ChatContext)
  useEffect(() => {
    let unsub

    if (data.chatId) {
      unsub = getConvMsgs(data.chatId, (newData) => {
        setMessages(newData)
      })
    }

    return () => {
      if (unsub) unsub()
    }
  }, [data.chatId])

  return (
    <section className="chat-container">
      <header className="chat-header"></header>
      <MessagesList messages={messages} />
      <SendMsgInput />
    </section>
  )
}
