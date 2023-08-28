import React, { useContext } from 'react'
import { ChatContext } from '../context/ChatContext'
import { ChatIcon } from '@heroicons/react/outline'
import { OnlineIndicator } from './OnlineIndicator'
export const ConversationPreview = ({ conv }) => {
  const { dispatch, data } = useContext(ChatContext)

  const activeConv = () => {
    return data.chatId.includes(conv.userInfo.uid)
  }
  const handleSelect = (user) => {
    dispatch({ type: 'CHANGE_USER', payload: user })
  }
  return (
    <div className="conv-preview" onClick={() => handleSelect(conv.userInfo)} style={{ backgroundColor: activeConv() ? '#fff' : '' }}>
      <div className="relative">
        <img src={conv.userInfo.photoURL} alt="user-avatar" />
        <OnlineIndicator isOnline={conv.userInfo.isOnline} />
      </div>
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
