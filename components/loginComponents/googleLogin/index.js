import React, { useEffect, useState } from 'react'
import { GoogleSignin, GoogleSigninButton } from '@react-native-community/google-signin'

export default googleLoginButton = ({ navigation }) => {
  //state for data and such
  const [googleSignInProcess, setGoogleSignInProcess] = useState(false)
  const [userData, setUserData] = useState([])

  //loading configuration once
  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
      webClientId: '1019649368804-e5738lkp357m82jjr2pjf97ml9ih0t51.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      //hostedDomain: '', // specifies a hosted domain restriction
      //loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      //accountName: '', // [Android] specifies an account name on the device that should be used
      //iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    })
  }, [])

  const signIn = async () => {
    try {
      setGoogleSignInProcess(true)
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      let responseData = {
        first_name: userInfo.user.givenName,
        last_name: userInfo.user.familyName,
      }
      setUserData(responseData)
      setGoogleSignInProcess(false)
      navigation.navigate('ChatOverviews')
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled login process')
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('User already trying to login')
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Google play serioces out of date or unavailable')
      } else {
        console.log('Unknown error')
      }
    }
  }

  return (
    <>
      <GoogleSigninButton
        style={{ width: 192, height: 48 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={() => signIn()}
        disabled={googleSignInProcess}
      />
    </>
  )
}