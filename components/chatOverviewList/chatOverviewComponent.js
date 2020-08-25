import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native'
import { getChatRooms } from '../../controllers/chatroomcontroller'
import messaging from '@react-native-firebase/messaging'

//WIDTH of device
const WIDTH = Math.round(Dimensions.get('window').width)

export default chatOverviewList = ({ route, navigation }) => {
  //Setting states and grabbing navigation prop passed to this function
  const userData = route.params
  const [chatRooms, SetChatRooms] = useState([])
  const [refreshing, setRefreshingState] = useState(false)

  //Setting notification on subscription up
  messaging().onNotificationOpenedApp((remoteMessage) => {
    const ChatRoom = {
      id: remoteMessage.from.split('/topics/').pop(),
    }
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.from.split('/topics/').pop(),
    )
    navigation.navigate('ChatWindow', { userData, ChatRoom })
  })

  //fetching data from backend to display chatrooms
  const fetchData = async () => {
    const RetrieveChatRoomData = await getChatRooms()
    SetChatRooms(RetrieveChatRoomData)
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Combining full name from facebook/google API
  const renderFullName = (userData) => {
    return userData.first_name + ' ' + userData.last_name
  }

  // Updating user list when user dragging the chatoverview screen down
  const RefreshList = () => {
    setRefreshingState(true)
    fetchData()
    setRefreshingState(false)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.overviewText}>
        Welcome {renderFullName(userData)}, select your Chatroom
      </Text>
      <FlatList
        data={chatRooms}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatBoxStyle}
            key={item.name}
            onPress={() => {
              const ChatRoom = item
              navigation.navigate('ChatWindow', { userData, ChatRoom })
            }}>
            <View>
              <Text style={styles.chatBoxText}>{item.name}</Text>
              <Text style={styles.chatBoxDesc}>{item.desc}</Text>
            </View>
            <Text style={styles.arrowIcon}>{'>'}</Text>
          </TouchableOpacity>
        )}
        refreshing={refreshing}
        onRefresh={() => RefreshList()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBoxStyle: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
    width: WIDTH - 25,
    padding: 10,
    margin: 10,
    flexDirection: 'row',
  },
  chatBoxText: {
    fontSize: 16,
  },
  chatBoxDesc: {
    fontSize: 12,
  },
  arrowIcon: {
    flex: 1,
    fontSize: 30,
    textAlign: 'right',
  },
})
