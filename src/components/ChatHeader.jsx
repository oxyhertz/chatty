import React from 'react'

export const ChatHeader = ({ convUser }) => {
  console.log('🚀 ~ file: ChatHeader.jsx:4 ~ ChatHeader ~ convUser:', convUser)
  return (
    <header className="chat-header">
      <section className="user-conv-info">
        <img src={convUser.photoURL} alt="" className="rounded-img" />
        <div className="user-inf">
          <h3>{convUser.displayName}</h3>
          <span className="status">{`${convUser.isOnline ? 'Online' : ''}`}</span>
        </div>
      </section>
    </header>
  )
}
