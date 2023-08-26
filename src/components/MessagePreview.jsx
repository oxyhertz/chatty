import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
export const MessagePreview = ({ msg }) => {
  console.log('🚀 ~ file: MessagePreview.jsx:4 ~ MessagePreview ~ msg:', msg)
  const { loggedInUser } = useContext(AuthContext)
  console.log('🚀 ~ file: MessagePreview.jsx:5 ~ MessagePreview ~ loggedInUser:', loggedInUser)
  return (
    <div className={`msg-preview ${loggedInUser.uid !== msg.senderId ? 'to-user-msg' : ''}`}>
      <span>{msg.text}</span>
    </div>
  )
}
