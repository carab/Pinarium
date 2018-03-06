import database from './database'
import {getUser} from './authApi'

function getCollection(db) {
  return db
    .collection('users')
    .doc(getUser().uid)
    .collection('crates')
}

export async function onRefreshCrates(callback) {
  const unsubscribe = getCollection(await database).onSnapshot(callback)
  return unsubscribe
}

export async function saveCrate(crate, id) {
  const collection = getCollection(await database)

  if (Array.isArray(crate.history)) {
    crate.quantity = crate.history.reduce(
      (total, entry) => total + Number(entry.quantity),
      0
    )
  }

  if (id) {
    return collection.doc(id).set(crate)
  }

  return collection.add(crate)
}

export async function fetchCrate(id) {
  const collection = getCollection(await database)
  const snapshot = await collection.doc(id).get()
  return snapshot.data()
}

export async function deleteCrate(id) {
  const collection = getCollection(await database)
  return collection.doc(id).delete()
}
