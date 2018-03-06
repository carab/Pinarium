import database from './database'
import {getUser} from './authApi'

function getCollection(db) {
  return db
    .collection('users')
    .doc(getUser().uid)
    .collection('cellars')
}

export async function onRefreshCellars(callback) {
  const unsubscribe = getCollection(await database).onSnapshot(callback)
  return unsubscribe
}

export async function createCellar(cellar) {
  return getCollection(await database).add(cellar)
}

export async function fetchCellar(ref) {
  const snapshot = await ref.get()
  return snapshot.data()
}
