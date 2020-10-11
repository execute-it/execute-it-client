import React from 'react';
import VoiceChannelComponent from "./voiceChannel.component";
import UserContext from "../../context/UserContext";
import cookie from 'react-cookies'

const socket = require('socket.io-client')


class VoiceChatMainComponent extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            socket: null
        }
        this.socket = null
        this.username = this.props.username;
        this.room = this.props.roomId
    }

    componentDidMount() {
        // TODO: Remove hardcoded URL later
        const voiceURL = process.env.REACT_APP_MEDIASOUP_URL;
        this.socket = socket(voiceURL, {
            path: '/socket.io',
            query: {
                roomId: this.room,
                peerName: this.username,
                token: cookie.load('jwt')
            },
        });

        this.socket.on('connect', () => {
            console.log(this.socket.id)
            this.socket.emit('authentication', {
                token: 'highSekurityToken',
                roomId: this.room
            });

            // Handle unauthorized
            this.socket.on('unauthorized', err => {
                console.log(err)
                this.socket.close()
                if (err.message.includes('Unauthorized'))
                    alert("Unauthenticated")
                else
                    alert("Not allowed in the room!")
            });

            // Handle successful auth
            this.socket.on('authenticated', () => {
                console.log("Logged In!");
                this.context.setVoiceConnected(true)
                this.setState({socket: this.socket})
            });

            this.socket.on('disconnect', ()=>{
                this.context.setVoiceConnected(false)
            })
        });
    }

    componentWillUnmount() {
        this.socket.disconnect()
        this.context.setVoiceConnected(false)
    }

    render() {
        return (<div >
            {this.state.socket && <VoiceChannelComponent socket={this.state.socket} username={this.username}/>}
        </div>)
    }
}

export default VoiceChatMainComponent;
