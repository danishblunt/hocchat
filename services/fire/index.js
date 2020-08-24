import Firebase from '@react-native-firebase/app'
import '@react-native-firebase/firestore'
import '@react-native-firebase/storage'
import messaging from '@react-native-firebase/messaging'

const firebaseConfig = {
  apiKey: 'AIzaSyDDwmmoX9m8FfOYsTGsB_o88Pn9YhlU7s8',
  authDomain: 'hocchat-ef691.firebaseapp.com',
  databaseURL: 'https://hocchat-ef691.firebaseio.com',
  projectId: 'hocchat-ef691',
  storageBucket: 'hocchat-ef691.appspot.com',
  messagingSenderId: '1019649368804',
  appId: '1:1019649368804:android:bc9c83b2ac79da14f942f1',
  measurementId: 'G-measurement-id',
}

//preventing reload issues
if (Firebase.apps.length == 0) {
  Firebase.initializeApp(firebaseConfig)
}

export const DB = Firebase.firestore()
export const FBStorage = Firebase.storage()
export const FBListener = Firebase.storage.TaskEvent.STATE_CHANGED

export const firebasePushSetup = async () => {
  const token = await messaging().getToken()
  console.log('TOKEN =', token)

  const granted = await messaging().requestPermission()
  console.log('GRANTED =', granted)

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage)
  })

  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    console.log('FCM Message Data:', remoteMessage.data)
  })

  return unsubscribe
}
