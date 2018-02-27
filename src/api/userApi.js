import db from './db'
import {getUser} from './authApi'

export async function fetchUser() {
  const ref = db.collection('users').doc(getUser().uid)

  const doc = await ref.get()

  if (doc.exists) {
    return doc.data()
  }

  ref.set({})

  return {}
}
