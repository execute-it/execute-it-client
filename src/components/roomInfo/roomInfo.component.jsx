import React from 'react'
import { Typography } from 'antd'

const { Title, Text } = Typography

const RoomInfo = (props) => {
    return (
        <div style={{ padding: '1rem' }}>
            <Typography.Title level={3}>Room Info</Typography.Title>
            <div>
                <Text strong>Room Name: </Text><Typography.Text>{props.roomName}</Typography.Text>

            </div>
            <div>
                <Text strong>Invite Code: </Text><Typography.Text>{props.inviteCode}</Typography.Text>
            </div>

        </div>
    )
}

export default RoomInfo