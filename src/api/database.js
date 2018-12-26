import firebase from './firebase'

async function initialize() {
  try {
    const firestore = firebase.firestore()
    const settings = {timestampsInSnapshots: true}
    firestore.settings(settings)

    await firestore.enablePersistence()

    return firestore
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
