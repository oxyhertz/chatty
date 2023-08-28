import React from 'react'

export const OnlineIndicator = ({ isOnline }) => {
  return <span className={`online-indicator ${isOnline ? '' : 'offline'}`}></span>
}
