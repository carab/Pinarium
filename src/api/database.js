import firebase from './firebase'

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

export default initialize()
