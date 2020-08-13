import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import LoginScreen from '../screens/login'
import ChatOverviews from '../screens/chatOverviews'

const NavigationStack = createStackNavigator()

export default navigationContainer = () => {
  return (
    <NavigationContainer>
      <NavigationStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <NavigationStack.Screen name="LoginScreen" component={LoginScreen} />
        <NavigationStack.Screen name="ChatOverviews" component={ChatOverviews} />
      </NavigationStack.Navigator>
    </NavigationContainer>
  )
}
