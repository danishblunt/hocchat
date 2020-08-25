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
import { getChatRooms } from './controllers/chatroomcontroller'
import AsyncStorage from '@react-native-community/async-storage'
import messaging from '@react-native-firebase/messaging'

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
    // set subscriptions
    const SetSubscriptions = async () => {
      const SubscribeIDs = await getChatRooms()
      const CheckForSubscription = async (ID) => {
        const subdata = await AsyncStorage.getItem(ID)
        if (subdata !== null) {
          messaging()
            .subscribeToTopic(ID)
            .then(() => {
              console.log('subscribed to topic')
              console.log(ID)
            })
        }
      }
      SubscribeIDs.map((SubscriptionItem) => CheckForSubscription(SubscriptionItem.id))
    }
    SetSubscriptions()
  }, [])
  return <NavigationStack />
}

export default App
