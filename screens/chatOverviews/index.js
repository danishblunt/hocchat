import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { getChatRooms } from '../../controllers/chatroomcontroller'

//ressource import
import ArrowImage from '../../resources/images/arrow.png'

export default chatOverviews = ({ route, navigation }) => {
  const userData = route.params
  const [chatRooms, SetChatRooms] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const RetrieveChatRoomData = await getChatRooms()
      SetChatRooms(RetrieveChatRoomData)
    }
    fetchData()
  }, [])

  const renderFullName = (userData) => {
    return userData.first_name + ' ' + userData.last_name
  }

  return (
    <View style={styles.container}>
      <Text style={styles.overviewText}>
        Welcome {renderFullName(userData)}, select your Chatroom
      </Text>
      {chatRooms.length > 0 &&
        chatRooms.map((ChatRoom) => {
          return (
            <TouchableOpacity
              style={styles.chatBoxStyle}
              key={ChatRoom.name}
              onPress={() => {
                navigation.navigate('ChatWindow', { userData, ChatRoom })
              }}>
              <View>
                <Text style={styles.chatBoxText}>{ChatRoom.name}</Text>
                <Text style={styles.chatBoxDesc}>{ChatRoom.desc}</Text>
              </View>
              <Image style={styles.arrowIcon} source={ArrowImage} />
            </TouchableOpacity>
          )
        })}
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
    backgroundColor: 'white',
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 5,
    width: '90%',
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
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    alignSelf: 'flex-end',
  },
})
