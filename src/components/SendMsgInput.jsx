import React, { useContext, useState } from 'react'
import { ChatContext } from '../context/ChatContext'
import { AuthContext } from '../context/AuthContext'
import { sendMsg } from '../services/firebase'
export const SendMsgInput = () => {
  const [text, setText] = useState('')
  const [img, setImg] = useState(null)
  const { loggedInUser } = useContext(AuthContext)
  const { data } = useContext(ChatContext)

  const hanldeSendMsg = async () => {
    await sendMsg(text, loggedInUser, data.chatId, img, data.user)
    setText('')
    setImg(null)
  }

  return (
    <div className="input">
      <input type="text" placeholder="Type something..." onChange={(e) => setText(e.target.value)} value={text} />
      <div className="send">
        <span>Attach file</span>
        <input type="file" style={{ display: 'none' }} id="file" onChange={(e) => setImg(e.target.files[0])} />
        <label htmlFor="file">
          <span>upload image</span>
        </label>
        <button onClick={hanldeSendMsg}>Send</button>
      </div>
    </div>
  )
}
