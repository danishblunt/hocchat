import React from 'react'
import ChatOverviewList from '../../components/chatOverviewList/chatOverviewComponent'

export default chatOverviews = ({ route, navigation }) => {
  return (
    <>
      <ChatOverviewList route={route} navigation={navigation} />
    </>
  )
}
