import firebase from './firebase'
import {getUser} from './authApi'

async function initialize() {
  try {
    await firebase.firestore().enablePersistence()
    return firebase.firestore()
  } catch (err) {
    if (err.code === 'failed-precondition') {
      throw err
    } else if (err.code === 'unimplemented') {
      throw err
    }
  }
}

const database = initialize()

export default database

export async function getUserCollection(collection) {
  return (await database)
    .collection('users')
    .doc(getUser().uid)
    .collection(collection)
}
