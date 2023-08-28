import { createContext, useEffect, useState } from 'react'
import { auth, updateUserPresence } from '../services/firebase.js'
import { onAuthStateChanged } from 'firebase/auth'

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
  const [loggedInUser, setloggedInUser] = useState({})

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log('holla')
      setloggedInUser(user)
      updateUserPresence(user.uid, true)
    })

    return () => {
      unsub()
    }
  }, [])

  return <AuthContext.Provider value={{ loggedInUser }}>{children}</AuthContext.Provider>
}
