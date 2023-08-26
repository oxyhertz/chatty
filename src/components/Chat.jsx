import React, { useContext, useEffect, useState } from 'react'
import { MessagesList } from './MessagesList'
import { ChatContext } from '../context/ChatContext'
import { getConvMsgs } from '../services/firebase'
import { db } from '../services/firebase'
import { SendMsgInput } from './SendMsgInput'
import { doc, onSnapshot } from 'firebase/firestore'
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
  // useEffect(() => {
  //   // let unsub
  //   // console.log('🚀 ~ file: Chat.jsx:13 ~ useEffect ~ data.chatId:', data.chatId)
  //   // if (data.chatId) {
  //   //   getConvMsgs(data.chatId).then((payload) => {
  //   //     console.log('🚀 ~ file: Chat.jsx:15 ~ getConvMsgs ~ payload.data:', payload.data)
  //   //     setMessages(payload.data)
  //   //     unsub = payload.unsub
  //   //   })
  //   // }
  //   // return () => {
  //   //   if (unsub) unsub()
  //   // }

  //   const unSub = onSnapshot(doc(db, 'conversations', data.chatId), (doc) => {
  //     if (doc.exists()) {
  //       setMessages(doc.data())
  //     }
  //   })

  //   return () => {
  //     unSub()
  //   }
  // }, [data.chatId])
  return (
    <section className="chat-container">
      <header className="chat-header"></header>
      <MessagesList messages={messages} />
      <SendMsgInput />
    </section>
  )
}
