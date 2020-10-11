import React from 'react'
import {Launcher} from 'react-chat-window'

import 'react-chat-widget/lib/styles.css';
class ChatComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            messages: [],
            messageList: [],
            displayName:''
        }

    }

    componentDidMount() {
        const { user } = this.props
        const displayName = user.displayName ? user.displayName : '' ;
        this.props.chatRoom.on("message", this._onRemoteMessage);
        this.setState({profilePhoto: JSON.parse(displayName).image,displayName:JSON.parse(displayName).displayName})
        console.log(this.props)
    }

    componentWillUnmount() {
        this.props.chatRoom.off("message", this._onRemoteMessage);
    }

    _onRemoteMessage = (event) => {
        let messages = this.state.messages.slice(0);
        let author = 'them'

        if(JSON.parse(event.user.displayName).displayName === this.state.displayName){
            author = 'me'
        }

        messages.push(
            {
                author: author,
                type: 'text',
                data: {text:event.message}
            }
            // <ChatMessage
            //     username={event.user.displayName}
            //     color={colorAssigner.getColorAsHex(e
            //     )}
            //     message={event.message}
            //     timestamp={new Date(event.timestamp)}
            //     key={this.state.messages.length}
            //     local={false}
            // />
        );
      
        this.setState({ messages: messages });
    }



    _onMessageWasSent(message) {
        console.log('sent', message)
        this.props.chatRoom.send(message.data.text)
        // this.setState({
        //   messages: [...this.state.messages, message]
        // })
      }

    render() {
        return (
            <div style={{ zIndex:'9999999' }}>
            <Launcher
            agentProfile={{
              teamName: this.state.displayName,
              imageUrl: this.state.profilePhoto
            }}
            onMessageWasSent={this._onMessageWasSent.bind(this)}
            messageList={this.state.messages}
            showEmoji
          />
          </div>
        )
    }
}

export default ChatComponent