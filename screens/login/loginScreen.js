import React, { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import FacebookLoginButton from '../../components/loginComponents/facebookLogin/facbookLoginComponent'
import GoogleLoginButton from '../../components/loginComponents/googleLogin/googleLoginComponent'
import AsyncStorage from '@react-native-community/async-storage'
import { CommonActions } from '@react-navigation/native'

export default LoginScreen = ({ navigation }) => {
  useEffect(() => {
    // If userdata exists from local device, login with those credetials
    const retrieveData = async () => {
      try {
        const LoginData = await AsyncStorage.getItem('userLogin')
        if (LoginData !== null) {
          const parsedData = JSON.parse(LoginData)
          navigation.navigate('ChatOverviews', parsedData)
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                {
                  name: 'ChatOverviews',
                  params: parsedData,
                },
              ],
            }),
          )
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
