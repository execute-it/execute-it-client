import React from 'react'
import {Button, Input, Typography} from 'antd'
import cookie from "react-cookies";

const {Text} = Typography

const RoomInfo = (props) => {
    const [portFwd, setPortFwd] = React.useState()

    function handleChangePortFwd(e) {
        // console.log(e.target.value)
        setPortFwd(e.target.value)
    }

    function handlePortFwd() {
        // TODO: Remove hardcoded URL later
        const roomURL = process.env.REACT_APP_ROOMS_URL || "https://rooms.executeit.ml";
        window.open(`${roomURL}/port-fwd-auth?token=${cookie.load('jwt')}&redirect=/${props.roomId}/${portFwd}/`)
    }

    return (
        <div style={{padding: '1rem'}}>
            <Typography.Title level={3}>Room Info</Typography.Title>
            <div>
                <Text strong>Room Name: </Text><Typography.Text>{props.roomName}</Typography.Text>

            </div>
            <br/>
            <div>
                <Text strong>Invite Code: </Text>
                <br/>
                <Typography.Text copyable>{`https://executeit.ml/join?inviteCode=${props.inviteCode}`}</Typography.Text>
            </div>
            <br/>
            <div>
                <Text strong>Connect to port: </Text>
                <br/>
                <Input
                    type={"number"}
                    value={portFwd}
                    onChange={handleChangePortFwd}
                    placeholder="8000"
                    style={{margin: '0.6rem 0rem'}}
                />
                <br/>
                <Button
                    size="small"
                    type="primary"
                    disabled={
                        !portFwd
                    }
                    onClick={handlePortFwd}
                    style={{float: 'right', marginTop: '0.5rem'}}>
                    Connect
                </Button>
            </div>

        </div>
    )
}

export default RoomInfo
