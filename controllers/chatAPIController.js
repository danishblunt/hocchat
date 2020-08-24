import axios from 'axios'

const FCMURL = 'https://fcm.googleapis.com/fcm/send'
const FCMKEY =
  'AAAA7WfWouQ:APA91bGW5h4F1OcLde_wBydd8iN_O3Qx5Qzg9IKYqTpSvQ9mJ_jZLux_pJFB3QC-jx2sk9je98TdyRoTlQqh9VE4QLEQ3fnV9NdhZUPKsPHGiaNZaLA0fvuGKgqq8dayxVTj5dhRfJ5y'

const buildRequest = (topic, message) => {
  const notificationData = {
    to: `/topics/${topic}`,
    priority: 'high',
    content_available: true,
    notification: {
      title: 'New message from House of Code Chat',
      body: message,
    },
  }

  return {
    url: FCMURL,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `key=${FCMKEY}`,
    },
    data: notificationData,
  }
}

export const sendMessageToCloud = async (topic, message) => {
  if (topic === undefined || topic === null || topic === '')
    return console.log('topic is undefined')
  await axios(buildRequest(topic, message))
  return true
}
