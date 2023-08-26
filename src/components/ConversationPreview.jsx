import React, { useContext } from 'react'
import { ChatContext } from '../context/ChatContext'

export const ConversationPreview = ({ conv }) => {
  const { dispatch } = useContext(ChatContext)

  const handleSelect = (user) => {
    dispatch({ type: 'CHANGE_USER', payload: user })
  }
  return (
    <div className="conv-preview" onClick={() => handleSelect(conv.userInfo)}>
      <img src={conv.userInfo.photoURL} alt="user-avatar" />
      <div className="user-inf">
        <h4 className="user-name">{conv.userInfo.displayName}</h4>
        <span className="conv-activity"></span>
      </div>
    </div>
  )
}
