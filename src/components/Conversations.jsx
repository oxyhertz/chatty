import React, { useContext, useEffect, useState } from 'react'
import { CurrentUser } from './CurrentUser'
import { Search } from './Search'
import { AuthContext } from '../context/AuthContext'
import { getUserConversations } from '../services/firebase'
import { ConversationList } from './ConversationList'
import { FavoriteConvs } from './FavoriteConvs'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../services/firebase'
import { ChatContext } from '../context/ChatContext'
export const Conversations = () => {
  const [convs, setConvs] = useState([])
  const { loggedInUser } = useContext(AuthContext)
  const { dispatch, data } = useContext(ChatContext)

  useEffect(() => {
    let unsub

    if (loggedInUser.uid) {
      unsub = getUserConversations(loggedInUser.uid, (newConvs) => {
        setConvs(newConvs)
      })
    }

    return () => {
      if (unsub) unsub()
    }
  }, [loggedInUser.uid])

  useEffect(() => {
    let unsubscribes

    if (convs.length) {
      // Create listeners for each document ID
      unsubscribes = convs.map(({ userInfo }) => {
        const documentRef = doc(db, 'users', userInfo.uid)

        return onSnapshot(documentRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const user = docSnapshot.data()
            const convsOnlineStatus = convs.map((conv) => {
              if (conv.userInfo.uid === user.uid) {
                conv.userInfo.isOnline = user.isOnline
              }

              if (conv.userInfo.uid === data.user.uid) {
                dispatch({ type: 'CHANGE_USER', payload: conv.userInfo })
              }
              return conv
            })
            setConvs(convsOnlineStatus)
          } else {
            console.log(`Document with ID ${userInfo.uid} does not exist!`)
          }
        })
      })
    }
    return () => {
      if (unsubscribes) unsubscribes.forEach((unsubscribe) => unsubscribe())
    }
  }, [convs.length])
  console.log('render')
  return (
    <section className="conversations-container">
      <CurrentUser />
      <FavoriteConvs />
      <Search />
      <ConversationList convs={convs} />
    </section>
  )
}
