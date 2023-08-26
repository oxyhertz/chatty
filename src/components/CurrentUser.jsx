import React from 'react'

export const CurrentUser = () => {
  return (
    <div className="current-user-info">
      <div className="img-wrapper">
        <div className="rounded-cut-img flex-center"></div>
        <img src="https://xsgames.co/randomusers/avatar.php?g=female" />
      </div>
      <div className="user-info">
        <h2>Rohmad Khoir</h2>
        <span>My Account</span>
      </div>
    </div>
  )
}
