import database, {getUserCollection} from './database'

const COLLECTION = 'cellars'

export async function onCellarsRefresh(callback) {
  const collection = await getUserCollection(COLLECTION)
  const unsubscribe = collection.onSnapshot(callback)
  return unsubscribe
}

export async function saveCellar(cellar, id) {
  const collection = await getUserCollection(COLLECTION)

  if (id) {
    return collection.doc(id).set(cellar)
  }

  return collection.add(cellar)
}

export async function onCellarRefresh(id, callback) {
  const collection = await getUserCollection(COLLECTION)
  const unsubscribe = collection.doc(id).onSnapshot(callback)
  return unsubscribe
}

export async function fetchCellar(id) {
  const collection = await getUserCollection(COLLECTION)
  const snapshot = await collection.doc(id).get()
  return snapshot.data()
}

export async function deleteCellar(id) {
  const collection = await getUserCollection(COLLECTION)
  return collection.doc(id).delete()
}

export async function updateCellars(cellars, data) {
  const batch = (await database).batch()

  cellars.forEach(cellar => {
    batch.update(cellar, data)
  })

  return batch.commit()
}