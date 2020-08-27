import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import {
  getChatRoomContentByID,
  addChatMessage,
  updateChatTimeStamp,
} from '../../controllers/chatroomcontroller'
import { View, TouchableOpacity, StyleSheet, Alert, AsyncStorage } from 'react-native'
import { DB, FBStorage, FBListener } from '../../services/fire'
import ImagePicker from 'react-native-image-picker'
import 'react-native-get-random-values'
import { Icon } from 'react-native-elements'
import RNFS from 'react-native-fs'
import { sendMessageToCloud } from '../../controllers/chatAPIController'

import { v4 as uuidv4 } from 'uuid'

export default ChatWindow = ({ route, navigation }) => {
  // States for the Application
  const [messages, setMessages] = useState([])
  const [imageurl, setImage] = useState(null)
  const { userData, ChatRoom } = route.params
  const username = userData.first_name + ' ' + userData.last_name
  let subscribedToChat = false

  //Convert Timestamp, makes sorting much easier
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
          avatar: MsgData.avatar === null ? undefined : MsgData.avatar === null,
        },
        image: MsgData.image,
      }))
      //Setting Data into state
      setMessages(MessageData)
    }

    // Retrieve subscription to topics for notifications
    const retrieveSubscriptionData = async () => {
      try {
        const subdata = await AsyncStorage.getItem(ChatRoom.id)
        if (subdata === 'true') {
          subscribedToChat = true
        }
      } catch (error) {
        console.log(error)
      }
    }
    retrieveSubscriptionData()

    // Update chat on new messages
    const unsubscribe = DB.collection('chatRooms')
      .doc(ChatRoom.id)
      .collection('chatContent')
      .onSnapshot(() => fetchData())

    return () => unsubscribe()
  }, [])

  // Strange functiuon needed for functionality
  const logme = () => {
    console.log('idk why this is necceccary')
  }

  //Image Uploading logic
  const uploadImage = async (source) => {
    console.log(source)
    if (source) {
      const ImageData = await RNFS.readFile(source.uri, 'base64')
      let FileExtension = ''
      if (source.fileName !== null) {
        FileExtension = source.fileName.split('.').pop()
      } else {
        FileExtension = source.type.split('/').pop()
      }
      var uuid = uuidv4()
      const fileName = `${uuid}.${FileExtension}`
      var storageRef = FBStorage.ref(`chatImages/${fileName}`)
      storageRef.putString(ImageData, 'base64').on(
        FBListener,
        (snapshop) => {
          console.log(snapshop.state)
        },
        logme(),
        () => {
          storageRef
            .getDownloadURL()
            .then((url) => {
              setImage(url)
              const MessageFormatData = {
                avatar: userData.avatar,
                dateTime: convertToTimeStamp(new Date()),
                userName: username,
                message: '',
                image: url,
              }
              addChatMessage(ChatRoom.id, MessageFormatData)
              setImage(null)
            })
            .catch((e) => console.log('getting downloadURL of image error => ', e))
        },
      )
    }
  }

  // Image pick handler to set to state
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
        alert('Image picking process cancelled')
        console.log('User cancelled image picker')
      } else if (response.error) {
        alert('Error' + response.error)
        console.log('ImagePicker Error: ', response.error)
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton)
      } else {
        uploadImage(response)
      }
    })
  }

  // Image Pickup icon for Chat
  function renderImages() {
    return (
      <View style={styles.folderIcon}>
        <TouchableOpacity onPress={() => handlePickImage()}>
          <Icon name="folder" type="font-awesome" />
        </TouchableOpacity>
      </View>
    )
  }

  //Send Function logic for GiftedChat
  const onSend = useCallback((messages = []) => {
    //check if subscribed
    if (!subscribedToChat) {
      Alert.alert(
        'Notifications',
        'Do you want to enable notifications for this chatroom?',
        [
          {
            text: 'No',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              AsyncStorage.setItem(ChatRoom.id, 'true')
              console.log('accepted')
            },
          },
        ],
        { cancelable: false },
      )
    }
    subscribedToChat = true
    //formatted data for the database
    const MessageFormatData = {
      avatar: userData.avatar,
      dateTime: convertToTimeStamp(messages[0].createdAt),
      userName: messages[0].user.name,
      message: messages[0].text,
      image: imageurl,
    }
    addChatMessage(ChatRoom.id, MessageFormatData)
    setImage(null)
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))
    updateChatTimeStamp(ChatRoom.id, MessageFormatData.dateTime)
    sendMessageToCloud(ChatRoom.id, MessageFormatData.message)
  }, [])

  return (
    <GiftedChat
      renderUsernameOnMessage={true}
      messages={messages}
      renderActions={renderImages}
      onSend={(messages) => onSend(messages)}
      showUserAvatar={true}
      user={{
        _id: username,
        name: username,
        avatar: userData.avatar,
      }}
    />
  )
}

const styles = StyleSheet.create({
  folderIcon: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 10,
  },
})
