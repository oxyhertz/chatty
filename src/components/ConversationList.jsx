import React from 'react'
import { ConversationPreview } from './ConversationPreview'
export const ConversationList = ({ convs }) => {
  return <section className="conv-list">{convs.length && convs.map((conv) => <ConversationPreview key={conv.convId} conv={conv}></ConversationPreview>)}</section>
}
