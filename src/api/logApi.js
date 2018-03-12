import database, {getUserCollection} from './database'

const COLLECTION = 'logs'

export async function onLogsRefresh(callback) {
  const collection = await getUserCollection(COLLECTION)
  const unsubscribe = collection.onSnapshot(callback)
  return unsubscribe
}

export async function saveLog(log, id) {
  const collection = await getUserCollection(COLLECTION)

  if (id) {
    return collection.doc(id).set(log)
  }

  return collection.add(log)
}

export async function onLogRefresh(id, callback) {
  const collection = await getUserCollection(COLLECTION)
  const unsubscribe = collection.doc(id).onSnapshot(callback)
  return unsubscribe
}

export async function fetchLog(id) {
  const collection = await getUserCollection(COLLECTION)
  const snapshot = await collection.doc(id).get()
  return snapshot.data()
}

export async function deleteLog(id) {
  const collection = await getUserCollection(COLLECTION)
  return collection.doc(id).delete()
}
