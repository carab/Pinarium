import firebase from '../api/firebase'

export default function equals(a, b) {
  if (a instanceof firebase.firestore.DocumentReference) {
    a = a.id
  }

  if (b instanceof firebase.firestore.DocumentReference) {
    b = b.id
  }

  if (a instanceof Date) {
    a = a.getTime()
  }

  if (b instanceof Date) {
    b = b.getTime()
  }

  return a === b
}
