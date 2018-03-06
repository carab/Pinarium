import firebase from 'firebase'
import 'firebase/firestore'

firebase.initializeApp({
  apiKey: 'AIzaSyAzxN-ud1aXlIKeM7L6S-IAaFpDj22ecjw',
  authDomain: 'vinarium.firebaseapp.com',
  databaseURL: 'https://vinarium.firebaseio.com',
  projectId: 'firebase-vinarium',
  storageBucket: 'firebase-vinarium.appspot.com',
  messagingSenderId: '917810871864',
})

export default firebase
