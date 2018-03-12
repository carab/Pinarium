import database, {getUserCollection} from './database'

const COLLECTION = 'etiquettes'

export async function onEtiquettesRefresh(callback) {
  const collection = await getUserCollection(COLLECTION)
  const unsubscribe = collection.onSnapshot(callback)
  return unsubscribe
}

export async function saveEtiquette(etiquette, id) {
  const collection = await getUserCollection(COLLECTION)

  if (id) {
    return collection.doc(id).set(etiquette)
  }

  return collection.add(etiquette)
}

export async function onEtiquetteRefresh(id, callback) {
  const collection = await getUserCollection(COLLECTION)
  const unsubscribe = collection.doc(id).onSnapshot(callback)
  return unsubscribe
}

export async function fetchEtiquette(id) {
  const collection = await getUserCollection(COLLECTION)
  const snapshot = await collection.doc(id).get()
  return snapshot.data()
}

export async function deleteEtiquette(id) {
  const collection = await getUserCollection(COLLECTION)
  return collection.doc(id).delete()
}
