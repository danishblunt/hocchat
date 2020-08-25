import React, { useState } from 'react'
import { LoginButton, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk'
import AsyncStorage from '@react-native-community/async-storage'

export default facebookLoginButton = ({ navigation }) => {
  // state for user data
  const [userData, setFacebookLoginData] = useState([])

  // get Facebook data
  GetInformationFromToken = (Data) => {
    const User = {
      fields: {
        string: 'id, first_name, last_name, middle_name',
      },
    }
    const retrieveInformation = new GraphRequest(
      '/me',
      { Data, parameters: User },
      (error, Result) => {
        if (error) {
          console.log('login error:' + error)
        } else {
          setFacebookLoginData(Result)
        }
      },
    )
    new GraphRequestManager().addRequest(retrieveInformation).start()
  }

  return (
    <>
      <LoginButton
        publishPermissions={['email']}
        onLoginFinished={(error, result) => {
          if (error) {
            alert('Login failed with error: ' + error.message)
          } else if (result.isCancelled) {
            alert('Login was cancelled')
          } else {
            // Get user data when logged in
            AccessToken.getCurrentAccessToken().then((User) => {
              const accessToken = User.accessToken.toString()
              GetInformationFromToken(accessToken)
            })
            if (userData !== null || userData !== undefined) {
              AsyncStorage.setItem('userLogin', JSON.stringify(userData))
              navigation.navigate('ChatOverviews', userData)
            }
          }
        }}
        onLogoutFinished={() => alert('User logged out')}
      />
    </>
  )
}
