//services
import { DB } from '../services/fire'

//settings default limit
let DEFAULT_LIMIT = 50

// get chat rooms
export const getChatRooms = async () => {
  let ChatRoom = []
  await DB.collection('chatRooms')
    .get()
    .then((AllChatRooms) => {
      AllChatRooms.forEach((Chatroom) => {
        let tempObject = Chatroom.data()
        tempObject.id = Chatroom.id
        ChatRoom.push(tempObject)
      })
    })
  if (ChatRoom === undefined || ChatRoom === null || ChatRoom === '')
    return console.log('Data not found')
  return ChatRoom
}

//get messagges and content
export const getChatRoomContentByID = async (ChatRoomID, limit = 0) => {
  console.log('called')
  if (limit === 0) limit = DEFAULT_LIMIT
  let ChatRoomContent = []
  if (ChatRoomID === undefined || ChatRoomID === null || ChatRoomID === '')
    return console.log('Invalid Chatroom ID')

  await DB.collection('chatRooms')
    .doc(ChatRoomID)
    .collection('chatContent')
    .limit(limit)
    .orderBy('dateTime', 'desc')
    .get()
    .then((AllMessages) => {
      AllMessages.forEach((Message) => {
        let tempObject = Message.data()
        tempObject.id = Message.id
        ChatRoomContent.push(tempObject)
      })
    })

  if (ChatRoomContent === undefined || ChatRoomContent === null || ChatRoomContent === '')
    return console.log('Data not found')
  return ChatRoomContent
}

//writing messages
export const addChatMessage = async (ChatRoomID, chatData) => {
  if (ChatRoomID === undefined || ChatRoomID === null) return console.log('Invalid Chatroom ID')
  if (chatData === undefined || chatData === null) return console.log('Invalid Data')
  await DB.collection('chatRooms').doc(ChatRoomID).collection('chatContent').add(chatData)
}
