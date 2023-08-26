import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
export const CurrentUser = () => {
  const { loggedInUser } = useContext(AuthContext)
  const { photoURL, displayName } = loggedInUser
  return (
    <div className="current-user-info">
      <div className="img-wrapper">
        <div className="rounded-cut-img flex-center"></div>
        <img src={photoURL} />
      </div>
      <div className="user-info">
        <h2>{displayName}</h2>
        <span>My Account</span>
      </div>
    </div>
  )
}
