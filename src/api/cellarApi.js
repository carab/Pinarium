import db from './db'
import {getUser} from './authApi'

export function onFetch(callback) {
  const unsubscribe = db
    .collection('users')
    .doc(getUser().uid)
    .collection('cellars')
    .onSnapshot(callback)

  return unsubscribe
}

export async function createCellar(cellar) {
  return db
    .collection('users')
    .doc(getUser().uid)
    .collection('cellars')
    .add(cellar)
}

export async function fetchCellar(ref) {
  const snapshot = await ref.get()
  return snapshot.data()
}
