import messaging from '@react-native-firebase/messaging'

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
