import { initializeApp } from 'firebase/app'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { collection, doc, getDocs, getFirestore, onSnapshot, query, setDoc, where } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBwjZHFtcreNoCbxayQrb9fOhB38J8AiNI',
  authDomain: 'firechat-7e83d.firebaseapp.com',
  projectId: 'firechat-7e83d',
  storageBucket: 'firechat-7e83d.appspot.com',
  messagingSenderId: '695048466080',
  appId: '1:695048466080:web:b46c616e19c2c792f5e3c5',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth()
export const storage = getStorage()
export const db = getFirestore()

export async function getUserByName(username) {
  const q = query(collection(db, 'users'), where('displayName', '==', username))

  const querySnapshot = await getDocs(q)

  if (querySnapshot.empty) {
    // Handle the scenario where no user matches the given username.
    console.log('No user found with the given username.')
    throw 'No user found with the given username.'
  }
  const userDoc = querySnapshot.docs[0].data()

  return userDoc
}

export async function register(email, password, displayName, file) {
  const res = await createUserWithEmailAndPassword(auth, email, password)

  //Create a unique image name
  const date = new Date().getTime()
  const storageRef = ref(storage, `${displayName + date}`)

  return await uploadBytesResumable(storageRef, file).then(() => {
    getDownloadURL(storageRef).then(async (downloadURL) => {
      try {
        //Update profile
        await updateProfile(res.user, {
          displayName,
          photoURL: downloadURL,
        })
        //create user on firestore
        await setDoc(doc(db, 'users', res.user.uid), {
          uid: res.user.uid,
          displayName,
          email,
          photoURL: downloadURL,
        })

        //create empty user chats on firestore
        return await setDoc(doc(db, 'userConversations', res.user.uid), {})
      } catch (err) {
        throw err
      }
    })
  })
}
export async function login(email, password) {
  return await signInWithEmailAndPassword(auth, email, password)
}

export async function getUserConversations(userId) {
  return new Promise((resolve, reject) => {
    const unsub = onSnapshot(
      doc(db, 'userConversations', userId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = Object.entries(docSnapshot.data()).map((conv) => ({ convId: conv[0], ...conv[1] }))
          resolve({ data, unsub })
        } else {
          reject(new Error('No user data found'))
        }
        // unsub() // unsubscribe from the listener once we've got the data
      },
      (error) => {
        reject(error)
      }
    )
  })
}
