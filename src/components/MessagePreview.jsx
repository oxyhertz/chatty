import React, { useContext, useRef } from 'react'
import { AuthContext } from '../context/AuthContext'
export const MessagePreview = ({ msg }) => {
  const { loggedInUser } = useContext(AuthContext)
  const msgPreviewRef = useRef()
  useEffect(() => {
    msgPreviewRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [message])

  return (
    <div ref={msgPreviewRef} className={`msg-preview ${loggedInUser.uid !== msg.senderId ? 'to-user-msg' : ''}`}>
      <span>{msg.text}</span>
    </div>
  )
}
