import React, { useState } from 'react'
import { LoginButton, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk'

export default facebookLoginButton = () => {
  // state for user data
  const [FacebookLoginData, setFacebookLoginData] = useState([])

  // get Facebook data
  GetInformationFromToken = (Data) => {
    const userData = {
      fields: {
        string: 'id, first_name, last_name, middle_name',
      },
    }
    const retrieveInformation = new GraphRequest(
      '/me',
      { Data, parameters: userData },
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
            AccessToken.getCurrentAccessToken().then((userData) => {
              const accessToken = userData.accessToken.toString()
              GetInformationFromToken(accessToken)
              console.log('Logging' + FacebookLoginData)
            })
          }
        }}
        onLogoutFinished={() => alert('User logged out')}
      />
    </>
  )
}
