import React, { useContext, useState } from 'react'
import { getUserByName, addConv } from '../services/firebase'
import { AuthContext } from '../context/AuthContext'
import { SearchIcon } from '@heroicons/react/outline'
import OutsideClickHandler from 'react-outside-click-handler'
export const Search = () => {
  const [username, setUsername] = useState('')
  const [user, setSearchedUser] = useState(null)
  const [err, setErr] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const { loggedInUser } = useContext(AuthContext)

  const handleSearch = async () => {
    if (err) setErr(false)
    try {
      const user = await getUserByName(username)
      setSearchedUser(user)
    } catch (err) {
      setErr(true)
      setSearchedUser(null)
    }
  }

  const handleKey = (e) => {
    e.code === 'Enter' && handleSearch()
  }

  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId = loggedInUser.uid > user.uid ? loggedInUser.uid + user.uid : user.uid + loggedInUser.uid
    try {
      await addConv(combinedId, loggedInUser, user)
    } catch (err) {
      setErr(true)
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
      {err && <div>User not found!</div>}
      {user && (
        <OutsideClickHandler
          onOutsideClick={() => {
            setSearchedUser(null)
            setUsername('')
          }}
        >
          <div style={{ display: isImageLoaded ? '' : 'none' }} className="searched-user" onClick={handleSelect}>
            <img src={user.photoURL} alt="" onLoad={() => setIsImageLoaded(true)} className="rounded-img" />
            {isImageLoaded && (
              <div className="searched-user-nfo">
                <span>{user.displayName}</span>
              </div>
            )}
          </div>
        </OutsideClickHandler>
      )}
    </div>
  )
}
