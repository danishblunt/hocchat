/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react'
import NavigationStack from './routes/'
import { firebasePushSetup } from './services/fire'
import AsyncStorage from '@react-native-community/async-storage'

const App = () => {
  useEffect(() => {
    // retrieve notification
    const retrieveData = async () => {
      try {
        const NotificationData = await AsyncStorage.getItem('notification')
        if (NotificationData !== null) {
          const parsedData = JSON.parse(NotificationData)
          console.log(parsedData)
        }
      } catch (error) {
        console.log(error)
      }
    }
    retrieveData()
    // init pushnotification setup
    console.log('init push notification setup')
    firebasePushSetup()
  }, [])
  return <NavigationStack />
}

export default App
