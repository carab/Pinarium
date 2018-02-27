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

export function getUser() {
  return auth.currentUser
}

const authCallbacks = []

function executeCallbacks(user) {
  for (const index in authCallbacks) {
    authCallbacks[index](user)
  }
}

auth.onAuthStateChanged(executeCallbacks)

export function onAuth(callback) {
  authCallbacks.push(callback)
}

export function offAuth(callback) {
  const index = authCallbacks.indexOf(authCallbacks)
  if (-1 !== index) {
    delete authCallbacks[index]
  }
}
