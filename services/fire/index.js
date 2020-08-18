import Firebase from '@react-native-firebase/app'
import '@react-native-firebase/firestore'
import '@react-native-firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDDwmmoX9m8FfOYsTGsB_o88Pn9YhlU7s8',
  authDomain: 'hocchat-ef691.firebaseapp.com',
  databaseURL: 'https://hocchat-ef691.firebaseio.com',
  projectId: 'hocchat-ef691',
  storageBucket: 'hocchat-ef691.appspot.com',
  messagingSenderId: 'sender-id',
  appId: 'app-id',
  measurementId: 'G-measurement-id',
}

//preventing reload issues
if (Firebase.apps.length == 0) {
  Firebase.initializeApp(firebaseConfig)
}

export const DB = Firebase.firestore()
export const FBStorage = Firebase.storage()
export const FBListener = Firebase.storage.TaskEvent.STATE_CHANGED
