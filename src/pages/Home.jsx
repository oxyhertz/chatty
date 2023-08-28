import React, { useContext, useEffect, useState } from 'react'
import { MainNav } from '../components/MainNav'
import { Chat } from '../components/Chat'
import { Conversations } from '../components/Conversations'
import { doc, setDoc, onSnapshot } from 'firebase/firestore'
import { db, updateUserPresence } from '../services/firebase'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'
export const Home = () => {
  // const connectedUsersRef = ref(database, '.info/connected')
  const [onlineUsers, setOnlineUsers] = useState([])
  const { loggedInUser } = useContext(AuthContext)

  useEffect(() => {
    if (loggedInUser.uid) {
      const documentRef = doc(db, 'users', '53YunDoBgySOCfVGZ3Skh1fNSy72')

      // Attach the onSnapshot listener
      const unsubscribe = onSnapshot(documentRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          console.log('docSnapshot.data()', docSnapshot.data())
        } else {
          console.log('Document does not exist!')
        }
      })
      // Return cleanup function to handle the event listener removal
      updateUserPresence(loggedInUser.uid, true)
      window.addEventListener('beforeunload', () => updateUserPresence(loggedInUser.uid, false))
      return () => {
        window.removeEventListener('beforeunload', () => updateUserPresence(loggedInUser.uid, false))
        updateUserPresence(loggedInUser.uid, false)
        unsubscribe
      }
    }
  }, [loggedInUser])

  return (
    <section className="home-container">
      <Link to="/login">login</Link>
      <MainNav />
      <Conversations />
      <Chat />
    </section>
  )
}
