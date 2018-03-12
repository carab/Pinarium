import database, {getUserCollection} from './database'

const COLLECTION = 'shelves'

export async function onShelvesRefresh(callback) {
  const collection = await getUserCollection(COLLECTION)
  const unsubscribe = collection.onSnapshot(callback)
  return unsubscribe
}

export async function saveShelve(shelve, id) {
  const collection = await getUserCollection(COLLECTION)

  if (id) {
    return collection.doc(id).set(shelve)
  }

  return collection.add(shelve)
}

export async function onShelveRefresh(id, callback) {
  const collection = await getUserCollection(COLLECTION)
  const unsubscribe = collection.doc(id).onSnapshot(callback)
  return unsubscribe
}

export async function fetchShelve(id) {
  const collection = await getUserCollection(COLLECTION)
  const snapshot = await collection.doc(id).get()
  return snapshot.data()
}

export async function deleteShelve(id) {
  const collection = await getUserCollection(COLLECTION)
  return collection.doc(id).delete()
}
