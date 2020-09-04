import React from 'react'
import { render } from 'react-dom'
import { Card, Typography, Button } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined, RightOutlined } from '@ant-design/icons';
import {withRouter} from 'react-router-dom'
const { Paragraph } = Typography



const RoomCardComponent = ({ roomName, inviteCode, isAdmin,roomId,history }) => {
  const enterRoom = ()=>{
    history.push({
      pathname: '/workspace',
      state:
      {
          roomName: roomName,
          inviteCode: inviteCode,
          roomId: roomId
      }
  })
  }
  return (
    <Card
      size="small"
      title={roomName}
      style={{ width: 300 }}
      actions={[
        <SettingOutlined key="setting" />,
        <EditOutlined key="edit" />,
        <EllipsisOutlined key="ellipsis" />,
      ]}
    >
      <div>
        <Paragraph copyable={{ text: inviteCode }}>{`Invite Code:${inviteCode} `}.</Paragraph>
        <Paragraph>Role: {isAdmin ? 'Admin' : 'Participant'}</Paragraph>
        <Button onClick={enterRoom} icon={<RightOutlined />} type='primary' size='middle'>Enter</Button>

      </div>

    </Card>
  )
}

export default withRouter(RoomCardComponent)