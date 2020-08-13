import React, { useEffect, use } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import FacebookLoginButton from '../loginComponents/facebookLogin'
import GoogleLoginButton from '../loginComponents/googleLogin'

export default LoginScreen = () => {
  useEffect(() => {
    SplashScreen.hide()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.loginText}>Please login via Social Media</Text>
      <FacebookLoginButton />
      <GoogleLoginButton />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    alignSelf: 'center',
    fontSize: 14,
    padding: 25,
  },
})
