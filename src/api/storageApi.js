import firebase from './firebase';

const storageRef = firebase.storage().ref();

export default storageRef;

const URL_CACHE = {};

export async function getUrl(path) {
  if (URL_CACHE[path]) {
    return URL_CACHE[path];
  }

  const url = await storageRef.child(path).getDownloadURL();
  URL_CACHE[path] = url;

  return url;
}
