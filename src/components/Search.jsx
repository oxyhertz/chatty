import React, { useContext, useState } from 'react'
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore'
import { db, getUserByName } from '../services/firebase'
import { AuthContext } from '../context/AuthContext'
import { SearchIcon } from '@heroicons/react/outline'
export const Search = () => {
  const [username, setUsername] = useState('')
  const [user, setSearchedUser] = useState(null)
  const [err, setErr] = useState(false)

  const { loggedInUser } = useContext(AuthContext)

  const handleSearch = async () => {
    try {
      const user = await getUserByName(username)
      console.log('🚀 ~ file: Search.jsx:15 ~ handleSearch ~ user:', user)
      setSearchedUser(user)
    } catch (err) {
      console.log('🚀 ~ file: Search.jsx:18 ~ handleSearch ~ err:', err)
      setErr(true)
    }
  }

  const handleKey = (e) => {
    e.code === 'Enter' && handleSearch()
  }

  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId = loggedInUser.uid > user.uid ? loggedInUser.uid + user.uid : user.uid + loggedInUser.uid
    try {
      const res = await getDoc(doc(db, 'conversations', combinedId))

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, 'conversations', combinedId), { messages: [] })

        //create user chats
        await updateDoc(doc(db, 'userConversations', loggedInUser.uid), {
          [combinedId + '.userInfo']: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + '.date']: serverTimestamp(),
        })

        await updateDoc(doc(db, 'userConversations', user.uid), {
          [combinedId + '.userInfo']: {
            uid: loggedInUser.uid,
            displayName: loggedInUser.displayName,
            photoURL: loggedInUser.photoURL,
          },
          [combinedId + '.date']: serverTimestamp(),
        })
      }
    } catch (err) {
      console.log('🚀 ~ file: Search.jsx:59 ~ handleSelect ~ err:', err)
    }
    setSearchedUser(null)
    setUsername('')
  }
  return (
    <div className="search">
      <div className="inp-container">
        <SearchIcon />
        <input type="text" placeholder="Find a user" onKeyDown={handleKey} onChange={(e) => setUsername(e.target.value)} value={username} />
      </div>
      {err && <span>User not found!</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  )
}
