import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default LoginScreen = (userData) => {
  const renderFullName = (userData) => {
    if (userData.middle_name == '') return userData.first_name + '' + userData.last_name
    else return userData.first_name + '' + userData.middle_name + '' + userData.last_name
  }
  return (
    <View style={styles.container}>
      <Text style={styles.overviewText}>
        Welcome {renderFullName(userData)}, select your Chatroom
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
