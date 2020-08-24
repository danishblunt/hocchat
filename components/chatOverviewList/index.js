import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native'
import { getChatRooms } from '../../controllers/chatroomcontroller'

//WIDTH
const WIDTH = Math.round(Dimensions.get('window').width)

export default chatOverviewList = ({ route, navigation }) => {
  const userData = route.params
  const [chatRooms, SetChatRooms] = useState([])
  const [refreshing, setRefreshingState] = useState(false)

  const fetchData = async () => {
    const RetrieveChatRoomData = await getChatRooms()
    SetChatRooms(RetrieveChatRoomData)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const renderFullName = (userData) => {
    return userData.first_name + ' ' + userData.last_name
  }

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
