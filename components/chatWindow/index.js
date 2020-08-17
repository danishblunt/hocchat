import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { getChatRoomContentByID, addChatMessage } from '../../controllers/chatroomcontroller'
import { DB } from '../../services/fire'

export default function ChatWindow({ route, navigation }) {
  const [messages, setMessages] = useState([])
  const { userData, ChatRoom } = route.params
  const username = userData.first_name + ' ' + userData.last_name

  const convertToTimeStamp = (date) => {
    const Timestamp = date.getTime() / 1000
    return Timestamp.toFixed(0)
  }

  useEffect(() => {
    //fetching initial message data
    const fetchData = async () => {
      const RetrieveChatRoomData = await getChatRoomContentByID(ChatRoom.id)
      const MessageData = RetrieveChatRoomData.map((MsgData) => ({
        _id: MsgData.id,
        text: MsgData.message,
        createdAt: new Date(MsgData.dateTime * 1000),
        user: {
          _id: MsgData.userName,
          name: MsgData.userName,
          avatar: MsgData.avatar,
        },
      }))
      setMessages(MessageData)
    }

    const unsubscribe = DB.collection('chatRooms')
      .doc(ChatRoom.id)
      .collection('chatContent')
      .onSnapshot(() => fetchData(), console.log('Error on Snapshot'))

    return () => unsubscribe()
  }, [])

  const onSend = useCallback((messages = []) => {
    //formatted data for the database
    const MessageFormatData = {
      avatar: 'url',
      dateTime: convertToTimeStamp(messages[0].createdAt),
      userName: messages[0].user.name,
      message: messages[0].text,
    }
    addChatMessage(ChatRoom.id, MessageFormatData)
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))
  }, [])

  return (
    <GiftedChat
      renderUsernameOnMessage={true}
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: username,
        name: username,
      }}
    />
  )
}
