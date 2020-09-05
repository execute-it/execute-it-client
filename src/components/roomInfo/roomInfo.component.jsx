import React, {useState} from 'react'
import { Typography } from 'antd'

const { Text } = Typography

const RoomInfo = (props) => {

    const [ link , setLink ] = useState(`https://executeit.ml/join?inviteCode=${props.inviteCode}`)

    return (
        <div style={{ padding: '1rem' }}>
            <Typography.Title level={3}>Room Info</Typography.Title>
            <div>
                <Text strong>Room Name: </Text><Typography.Text>{props.roomName}</Typography.Text>

            </div>
            <br/>
            <div>
                <Text strong>Invite Link: </Text>
                <br/>
                <Typography.Text copyable> {link}</Typography.Text>
            </div>

        </div>
    )
}

export default RoomInfo