import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { getChatRoomContentByID } from '../../controllers/chatroomcontroller'

export default function ChatWindow({ route, navigation }) {
  const [messages, setMessages] = useState([])
  const [ChatRoomData, setChatRoomData] = useState([])
  const { userData, ChatRoom } = route.params
  const username = userData.first_name + ' ' + userData.last_name

  useEffect(() => {
    const fetchData = async () => {
      const RetrieveChatRoomData = await getChatRoomContentByID(ChatRoom.id)
      setChatRoomData(RetrieveChatRoomData)

      const MessageData = ChatRoomData.map((MsgData) => ({
        _id: MsgData.id,
        text: MsgData.message,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: MsgData.userName,
          avatar: MsgData.avatar,
        },
      }))
      setMessages(MessageData)
    }

    fetchData()
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))
    console.log(ChatRoomData)
  }, [])

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
        name: username,
      }}
    />
  )
}
