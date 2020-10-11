import React from 'react'
import { Card, Typography, Button,Popconfirm,Space } from 'antd'
import { RightOutlined,  DeleteOutlined,QuestionCircleOutlined} from '@ant-design/icons';
import { withRouter } from 'react-router-dom'
const { Paragraph } = Typography



const RoomCardComponent = ({ roomName, inviteCode, isAdmin, roomId, history, roomURL,onConfirm }) => {
  const enterRoom = () => {
    history.push({
      pathname: '/workspace',
      state:
      {
        roomName: roomName,
        inviteCode: inviteCode,
        roomId: roomId,
        roomURL: roomURL,

      }
    })
  }

 

  const inviteLink = `https://executeit.ml/join?inviteCode=${inviteCode}`

  return (

    <Card
      size="small"
      title={roomName}
      style={{ width: 300, boxShadow: ' 0 0px 0px 0 rgba(0, 0, 0, 0.2), 0 3px 6px 0 rgba(0, 0, 0, 0.19)' }}
    // actions={[
    //   <SettingOutlined key="setting" />,
    //   <EditOutlined key="edit" />,
    //   <EllipsisOutlined key="ellipsis" />,
    // ]}
    >
      <div>
        <Paragraph copyable={{ text: inviteCode }}>{`Invite Code: ${inviteCode} `}.</Paragraph>
        <Paragraph copyable={{ text: inviteLink }}> {"Invite Link: " + inviteLink}</Paragraph>


        <Paragraph>Role: {isAdmin ? 'Admin' : 'Participant'}</Paragraph>

        <Space size='large'>
        <Button onClick={enterRoom} icon={<RightOutlined />} type='primary' size='middle'>Enter</Button>
        <Popconfirm disabled={!isAdmin} placement="top" title="Are you sure？"
                    icon={<QuestionCircleOutlined style={{color: "red"}}/>} onConfirm={() => onConfirm(roomId)} okText="Yes">
          <Button disabled={!isAdmin} type="primary" danger shape="round" icon={<DeleteOutlined/>}/>
        </Popconfirm>
        </Space> 
      </div>

    </Card>
  )
}

export default withRouter(RoomCardComponent)