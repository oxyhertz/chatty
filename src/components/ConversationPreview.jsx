import React, { useContext } from 'react'
import { ChatContext } from '../context/ChatContext'
import { ChatIcon } from '@heroicons/react/outline'

export const ConversationPreview = ({ conv }) => {
  const { dispatch, data } = useContext(ChatContext)
  console.log('🚀 ~ file: ConversationPreview.jsx:7 ~ ConversationPreview ~ data:', data)

  const activeConv = () => {
    return data.chatId.includes(conv.userInfo.uid)
  }
  const handleSelect = (user) => {
    dispatch({ type: 'CHANGE_USER', payload: user })
  }
  return (
    <div className="conv-preview" onClick={() => handleSelect(conv.userInfo)} style={{ backgroundColor: activeConv() ? '#fff' : '' }}>
      <img src={conv.userInfo.photoURL} alt="user-avatar" />

      <div className="user-inf">
        <h4 className="user-name">{conv.userInfo.displayName}</h4>
        <span className="conv-activity ">
          <div className="activity flex-center">
            <ChatIcon />
            <p>Text Message</p>
          </div>
          <div className="msg-count flex-center">
            <span>2</span>
          </div>
        </span>
      </div>
    </div>
  )
}
