//services
import { DB } from '../services/fire'

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
export const getChatRoomContentByID = async (ChatRoomID) => {
  let ChatRoomContent = []
  if (ChatRoomID === undefined || ChatRoomID === null || ChatRoomID === '')
    return console.log('Invalid Chatroom ID')
  await DB.collection('chatRooms')
    .doc(ChatRoomID)
    .collection('chatContent')
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
