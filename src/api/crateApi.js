import db from './db'
import {getUser} from './authApi'

function getCollection() {
  return db
    .collection('users')
    .doc(getUser().uid)
    .collection('crates')
}

export function onFetch(callback) {
  const unsubscribe = db
    .collection('users')
    .doc(getUser().uid)
    .collection('crates')
    .onSnapshot(callback)

  return unsubscribe
}

export function saveCrate(crate, id) {
  const collection = getCollection()

  if (id) {
    return collection.doc(id).set(crate)
  }

  return collection.add(crate)
}

export async function fetchCrate(id) {
  const collection = getCollection()
  const snapshot = await collection.doc(id).get()
  return snapshot.data()
}

export function deleteCrate(id) {
  const collection = getCollection()
  return collection.doc(id).delete()
}
