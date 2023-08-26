import React from 'react'

export const ConversationPreview = ({ conv }) => {
  return (
    <div>
      <pre>{JSON.stringify(conv)}</pre>
    </div>
  )
}
