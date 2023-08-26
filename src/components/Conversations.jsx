import React, { useContext, useEffect, useState } from 'react'
import { CurrentUser } from './CurrentUser'
import { Search } from './Search'
import { AuthContext } from '../context/AuthContext'
import { getUserConversations } from '../services/firebase'
import { ConversationList } from './ConversationList'
import { FavoriteConvs } from './FavoriteConvs'
export const Conversations = () => {
  const [convs, setConvs] = useState([])
  const { loggedInUser } = useContext(AuthContext)

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

  return (
    <section className="conversations-container">
      <CurrentUser />
      <FavoriteConvs />
      <Search />
      <ConversationList convs={convs} />
    </section>
  )
}
