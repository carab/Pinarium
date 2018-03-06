import firebase from './firebase'

export async function onStatusChange(callback) {
  return firebase
    .database()
    .ref('.info/connected')
    .on('value', function(snapshot) {
      const connected = snapshot.val()
      callback(connected)
    })
}
