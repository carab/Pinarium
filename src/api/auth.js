import firebase from './firebase'

const auth = firebase.auth()

export default auth

export function signUp(email, password) {
  return auth.createUserWithEmailAndPassword(email, password)
}

export function signIn(email, password) {
  return auth.signInWithEmailAndPassword(email, password)
}

export function signOut() {
  return auth.signOut()
}

export function onAuth(callback) {
  const unsubscribe = auth.onAuthStateChanged(callback)
  return unsubscribe
}

export function getUser() {
  return auth.currentUser
}
