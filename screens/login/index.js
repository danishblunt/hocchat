import React, { useEffect } from 'react'
import { View, Text, StyleSheet, AsyncStorage } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import FacebookLoginButton from '../../components/loginComponents/facebookLogin'
import GoogleLoginButton from '../../components/loginComponents/googleLogin'

export default LoginScreen = ({ navigation }) => {
  useEffect(() => {
    const retrieveData = async () => {
      try {
        const LoginData = await AsyncStorage.getItem('userLogin')
        if (LoginData !== null) {
          const parsedData = JSON.parse(LoginData)
          navigation.navigate('ChatOverviews', parsedData)
        }
      } catch (error) {
        console.log(error)
      }
    }
    retrieveData()
    SplashScreen.hide()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.loginText}>Please login via Social Media</Text>
      <FacebookLoginButton navigation={navigation} />
      <GoogleLoginButton navigation={navigation} />
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
