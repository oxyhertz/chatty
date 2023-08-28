import React, { useContext, useEffect, useState } from 'react'
import { MessagesList } from './MessagesList'
import { ChatContext } from '../context/ChatContext'
import { getConvMsgs } from '../services/firebase'
import { SendMsgInput } from './SendMsgInput'
import { ChatHeader } from './ChatHeader'
export const Chat = () => {
  const [messages, setMessages] = useState([])
  const { data } = useContext(ChatContext)
  useEffect(() => {
    let unsub

    if (data.chatId) {
      unsub = getConvMsgs(data.chatId, (msgs) => {
        setMessages(msgs)
      })
    }

    return () => {
      if (unsub) unsub()
    }
  }, [data.chatId])

  return (
    <section className="chat-container">
      <ChatHeader convUser={data.user} />
      <MessagesList messages={messages} />
      <SendMsgInput />
    </section>
  )
}
