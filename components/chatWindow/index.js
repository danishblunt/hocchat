import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { getChatRoomContentByID, addChatMessage } from '../../controllers/chatroomcontroller'
import { View, TouchableOpacity, Text } from 'react-native'
import { DB, FBStorage, FBListener } from '../../services/fire'
import ImagePicker from 'react-native-image-picker'
import 'react-native-get-random-values'
import { Icon } from 'react-native-elements'
import testimage from '../../resources/images/arrow.png'

import { v4 as uuidv4 } from 'uuid'

export default function ChatWindow({ route, navigation }) {
  const [messages, setMessages] = useState([])
  const [imageData, setImage] = useState(null)
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
      .onSnapshot(() => fetchData())

    return () => unsubscribe()
  }, [])

  const uploadImage = (source) => {
    if (source) {
      const FileExtension = source.fileName.split('.').pop()
      var uuid = uuidv4()
      const fileName = `${uuid}.${FileExtension}`
      const ImageSource = source.uri

      var storageRef = FBStorage.ref(`chatImages/${fileName}`)

      storageRef.putFile(ImageSource).on(FBListener, (snapshop) => {
        console.log(snapshop)
      })
    }
  }

  const handlePickImage = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    }
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton)
      } else {
        setImage(response)
        uploadImage(response)
      }
    })
  }

  function renderImages() {
    return (
      <View>
        <TouchableOpacity onPress={() => handlePickImage()}>
          <Icon name="folder" />
        </TouchableOpacity>
      </View>
    )
  }

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
      renderActions={renderImages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: username,
        name: username,
      }}
    />
  )
}
