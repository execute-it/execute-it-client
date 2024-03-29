import React from "react";
import axios from "axios";
import cookie from "react-cookies";
import RoomCardComponent from "../../components/roomCard/roomCard.component";
import {Button, Col, Input, Modal, notification, Row, Space, Tooltip, Typography,} from "antd";
import {CodeOutlined, PlusOutlined} from "@ant-design/icons";
import qs from "querystring";
import {withRouter} from "react-router-dom";
import validator from "validator";

class RoomPage extends React.Component {
    constructor(props) {
        super(props);
        axios.defaults.headers.common["x-api-key"] = cookie.load("jwt");
        axios.defaults.headers.common["Content-Type"] =
            "application/x-www-form-urlencoded";
        this.state = {
            rooms: [],
            visible: false,
            roomName: "",
            joinRoomData: "",
        };
    }


    componentDidMount() {
        this.fetchRooms();
    }

    fetchRooms() {
        axios.get(`${process.env.REACT_APP_MAIN_SERVER}/rooms`).then((res) => {
            this.setState({rooms: res.data.rooms});
            let count = 0
            for (let x in res.data.rooms) {
                if (res.data.rooms[x].isHost)
                    this.setState({hostRooms: ++count});
            }
            // console.log(this.state.rooms);
        });
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = async () => {
        this.setState({
            confirmLoading: true,
        });

        const requestBody = {
            roomName: this.state.roomName,
        };

        axios
            .post(
                `${process.env.REACT_APP_MAIN_SERVER}/rooms`,
                qs.stringify(requestBody)
            )
            .then((res) => {
                // console.log(res, "PRATIK");
                this.setState({
                    confirmLoading: false,
                    visible: false,
                    roomName: "",
                });
                return res;
            })
            .then((res) => {
                notification.success({
                    message: "Room Created",
                    description: `Room ${res.data.roomName} was created successfully, Now invite paritcipants using invite link`,
                });
                this.setState({joinRoomData: ""});
                return res.data;
            })
            .then((data) => {
                // console.log(":LLL", data);
                this.props.history.push({
                    pathname: "/workspace",
                    state: {
                        roomName: data.roomName,
                        inviteCode: data.inviteCode,
                        roomId: data.roomId,
                        roomURL: data.roomURL,
                    },
                });
            })
            .catch((e, res) => {
                this.setState({
                    confirmLoading: false,
                    visible: false,
                    roomName: "",
                });
                if (e.response.data.status === "room_name_duplicate") {
                    notification.warning({
                        message: "Duplicate Room Name",
                        description: `Please enter new room name`,
                    });
                    this.setState({visible: true});
                } else {
                    notification.error({
                        message: "Error",
                        description: `Some Error Occurred`,
                    });
                }
            });
    };

    handleCancel = () => {
        // console.log("Clicked cancel button");
        this.setState({
            visible: false,
        });
    };

    changeRoomName = (e) => {
        this.setState({roomName: e.target.value});
    };

    changeJoinRoomName = (e) => {
        this.setState({joinRoomData: e.target.value});
    };

    onDeleteRoom = (roomId) => {
        axios.delete(`${process.env.REACT_APP_MAIN_SERVER}/rooms/${roomId}`)
            .then(() => {
                    this.fetchRooms();
                }
            )
            .then(() => {
                notification.success({
                    message: "Room Delete",
                    description: `Room was deleted successfully!!`,
                })

            })
            .catch(() => {
                notification.error({
                    message: "Error",
                    description: `Some Error Occurred`,
                });
            })
    }

    joinRoom = () => {
        if (validator.isUUID(this.state.joinRoomData)) {
            // console.log(this.state.joinRoomData);
            axios
                .post(
                    `${process.env.REACT_APP_MAIN_SERVER}/rooms/join?inviteCode=${this.state.joinRoomData}`
                )
                .then((res) => {
                    notification.success({
                        message: "Room Joined",
                        description: `Room ${res.data.roomName} was joined successfully.`,
                    });
                    return res.data;
                })
                .then((data) => {
                    // console.log(":LLL", data);

                    this.props.history.push({
                        pathname: "/workspace",
                        state: {
                            roomName: data.roomName,
                            inviteCode: data.inviteCode,
                            roomId: data.roomId,
                            roomURL: data.roomURL,
                        },
                    });
                })
                .catch((e) => {
                    if (e.response.data.status === "already_joined") {
                        notification.warning({
                            message: "Room Already Joined",
                            description: `You have already joined the room, find your room in my rooms section and click on enter button`,
                        });
                    } else {
                        notification.error({
                            message: "Error",
                            description: `Some Error Occurred`,
                        });
                    }
                });
        } else {
            notification.error({
                message: "Invalid Invite Code",
                description: `Please recheck invite code`,
            });
        }
    };

    render() {
        const rooms = this.state.rooms;
        // console.log(rooms);
        return (
            <Row>
                <Col xs={24} align="middle">
                    <div style={{padding: "3%"}}>
                        <Typography.Title>Rooms</Typography.Title>

                        <br/>
                        <br/>
                        <Row justify="center">
                            <Col xs={24} align="middle">
                                <Space size={50}>
                                    <Tooltip
                                        placement="top"
                                        title={
                                            this.state.hostRooms >= 2 ? (
                                                <Typography.Text>
                                                    You can only create 2 rooms
                                                </Typography.Text>
                                            ) : (
                                                <Typography.Text>Create new room</Typography.Text>
                                            )
                                        }>
                                        <Button
                                            onClick={() => {
                                                this.setState({visible: true});
                                            }}
                                            type="primary"
                                            size="large"
                                            icon={<PlusOutlined/>}
                                            disabled={this.state.hostRooms >= 2}>
                                            Create Room
                                        </Button>
                                    </Tooltip>
                                    <Space size="middle">
                                        <Input
                                            onChange={this.changeJoinRoomName}
                                            value={this.state.joinRoomData}
                                            style={{width: "30vw"}}
                                            size="large"
                                            placeholder="Enter Invite Code"
                                        />
                                        <Button
                                            disabled={this.state.joinRoomData.length === 0}
                                            onClick={this.joinRoom}
                                            type="primary"
                                            size="large"
                                            icon={<CodeOutlined/>}>
                                            Join Room
                                        </Button>
                                    </Space>
                                </Space>
                            </Col>
                        </Row>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <Row justify="center" gutter={[10, 24]}>
                            {rooms.map((x) => (
                                <Col
                                    key={x.inviteCode}
                                    xs={24}
                                    md={12}
                                    lg={8}
                                    xl={6}
                                    align="middle">
                                    <RoomCardComponent
                                        roomName={x.roomName}
                                        inviteCode={x.inviteCode}
                                        isAdmin={x.isHost}
                                        roomId={x.roomId}
                                        roomURL={x.roomURL}
                                        onConfirm={this.onDeleteRoom}
                                    />
                                </Col>
                            ))}
                        </Row>
                        <Modal
                            title="Create Room"
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            confirmLoading={this.state.confirmLoading}
                            onCancel={this.handleCancel}
                            okButtonProps={{
                                disabled: this.state.roomName.length === 0,
                            }}>
                            <Input
                                value={this.state.roomName}
                                onChange={this.changeRoomName}
                                placeholder="Room Name"
                            />
                        </Modal>
                    </div>
                </Col>
            </Row>
        );
    }
}

export default withRouter(RoomPage);
