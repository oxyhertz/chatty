import { initializeApp } from 'firebase/app'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { arrayUnion, collection, doc, getDocs, getFirestore, onSnapshot, query, setDoc, where, serverTimestamp, Timestamp, updateDoc, getDoc } from 'firebase/firestore'
import { v4 as uuid } from 'uuid'

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

export function getUserConversations(userId, callback) {
  return onSnapshot(
    doc(db, 'userConversations', userId),
    (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = Object.entries(docSnapshot.data()).map((conv) => ({ convId: conv[0], ...conv[1] }))
        callback(data)
      } else {
        console.error('No user data found')
      }
    },
    (error) => {
      console.error('Error fetching user conversations:', error)
    }
  )
}

// export async function getUserConversations(userId) {
//   return new Promise((resolve, reject) => {
//     const unsub = onSnapshot(
//       doc(db, 'userConversations', userId),
//       (docSnapshot) => {
//         if (docSnapshot.exists()) {
//           const data = Object.entries(docSnapshot.data()).map((conv) => ({ convId: conv[0], ...conv[1] }))
//           resolve({ data, unsub })
//         } else {
//           reject(new Error('No user data found'))
//         }
//         // unsub() // unsubscribe from the listener once we've got the data
//       },
//       (error) => {
//         reject(error)
//       }
//     )
//   })
// }

export function getConvMsgs(chatId, callback) {
  return onSnapshot(
    doc(db, 'conversations', chatId),
    (docSnapshot) => {
      if (docSnapshot.exists()) {
        callback(docSnapshot.data().messages)
      }
    },
    (error) => {
      console.error('Error fetching conversation:', error)
    }
  )
}
// export async function getConvMsgs(chatId) {
//   console.log('🚀 ~ file: firebase.js:92 ~ getConvMsgs ~ chatId:', chatId)
//   return new Promise((resolve, reject) => {
//     const unsub = onSnapshot(
//       doc(db, 'conversations', chatId),
//       (docSnapshot) => {
//         if (docSnapshot.exists()) {
//           const data = docSnapshot.data()
//           resolve({ data, unsub })
//         } else {
//           reject(new Error('No conversation found'))
//         }
//         // unsub() // unsubscribe from the listener once we've got the data
//       },
//       (error) => {
//         reject(error)
//       }
//     )
//   })
// }

export async function sendMsg(text, loggedInUser, chatId, img, toUser) {
  if (img) {
    const storageRef = ref(storage, uuid())

    const uploadTask = uploadBytesResumable(storageRef, img)

    uploadTask.on(
      (error) => {
        //TODO:Handle Error
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          await updateDoc(doc(db, 'conversations', chatId), {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: loggedInUser.uid,
              date: Timestamp.now(),
              img: downloadURL,
            }),
          })
        })
      }
    )
  } else {
    await updateDoc(doc(db, 'conversations', chatId), {
      messages: arrayUnion({
        id: uuid(),
        text,
        senderId: loggedInUser.uid,
        date: Timestamp.now(),
      }),
    })
  }

  await updateDoc(doc(db, 'userConversations', loggedInUser.uid), {
    [chatId + '.lastMessage']: {
      text,
    },
    [chatId + '.date']: serverTimestamp(),
  })

  return await updateDoc(doc(db, 'userConversations', toUser.uid), {
    [chatId + '.lastMessage']: {
      text,
    },
    [chatId + '.date']: serverTimestamp(),
  })
}

export async function addConv(combinedId, loggedInUser, toUser) {
  try {
    const res = await getDoc(doc(db, 'conversations', combinedId))

    if (!res.exists()) {
      //create a chat in chats collection
      await setDoc(doc(db, 'conversations', combinedId), { messages: [] })

      //create user chats
      await updateDoc(doc(db, 'userConversations', loggedInUser.uid), {
        [combinedId + '.userInfo']: {
          uid: toUser.uid,
          displayName: toUser.displayName,
          photoURL: toUser.photoURL,
        },
        [combinedId + '.date']: serverTimestamp(),
      })

      await updateDoc(doc(db, 'userConversations', toUser.uid), {
        [combinedId + '.userInfo']: {
          uid: loggedInUser.uid,
          displayName: loggedInUser.displayName,
          photoURL: loggedInUser.photoURL,
        },
        [combinedId + '.date']: serverTimestamp(),
      })
    }
    return res
  } catch (err) {
    throw err
  }
}
