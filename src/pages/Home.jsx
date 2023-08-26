import React from 'react'
import { MainNav } from '../components/MainNav'
import { Chat } from '../components/Chat'
import { Conversations } from '../components/Conversations'
export const Home = () => {
  return (
    <section className="home-container">
      <MainNav />
      <Conversations />
      <Chat />
    </section>
  )
}
