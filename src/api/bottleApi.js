import database, {getUserCollection} from './database'

const COLLECTION = 'bottles'

export async function onBottlesRefresh(callback) {
  const collection = await getUserCollection(COLLECTION)
  const unsubscribe = collection.onSnapshot(callback)
  return unsubscribe
}

export async function saveBottle(bottle, id) {
  const collection = await getUserCollection(COLLECTION)

  if (id) {
    return collection.doc(id).set(bottle)
  }

  return collection.add(bottle)
}

export async function onBottleRefresh(id, callback) {
  const collection = await getUserCollection(COLLECTION)
  const unsubscribe = collection.doc(id).onSnapshot(callback)
  return unsubscribe
}

export async function fetchBottle(id) {
  const collection = await getUserCollection(COLLECTION)
  const snapshot = await collection.doc(id).get()
  return snapshot.data()
}

export async function deleteBottle(id) {
  const collection = await getUserCollection(COLLECTION)
  return collection.doc(id).delete()
}

export async function updateBottles(bottles, data) {
  const batch = (await database).batch()

  bottles.forEach(bottle => {
    batch.update(bottle, data)
  })

  return batch.commit()
}
