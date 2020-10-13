import React from "react";
import colorAssigner from "../../utils/color-util";
import Participant from "../participant/participant.component";
import {Typography} from "antd";
import UserContext from "../../context/UserContext";

export default class ParticipantsList extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);

        this.state = {
            participants: []
        };
    }

    componentDidMount() {
        this.subscription = this.props.activity
            .participantsAsObservable()
            .subscribe((participants) => {
                // Remove bots (autoCull checking)
                let filteredParticipants = []
                let emails = []
                participants.forEach((participant) => {
                    const userEmail = JSON.parse(participant.user.displayName).email;
                    // console.log(userEmail)
                    if (!JSON.parse(participant.user.displayName).isBot && userEmail === this.context.user.email) {
                        if (emails.indexOf(userEmail) === -1) {
                            filteredParticipants.push(participant)
                            emails.push(userEmail)
                        }
                    }
                })
                participants.forEach((participant) => {
                    const userEmail = JSON.parse(participant.user.displayName).email;
                    // console.log(userEmail)
                    if (!JSON.parse(participant.user.displayName).isBot && userEmail !== this.context.user.email) {
                        if (emails.indexOf(userEmail) === -1) {
                            filteredParticipants.push(participant)
                            emails.push(userEmail)
                        }
                    }
                })

                this.setState({participants: filteredParticipants});
            });
    }

    componentWillUnmount() {
        if (typeof this.subscription !== "undefined") {
            this.subscription.unsubscribe();
        }
    }

    createParticipant(participant, isSelf) {
        // console.log(participant.user);
        const streams = this.context.audioStreams[JSON.parse(participant.user.displayName).email]
        return (
            <Participant
                key={participant.sessionId}
                displayName={participant.user.displayName}
                sessionId={participant.sessionId}
                isSelf={isSelf}
                color={colorAssigner.getColorAsHex(participant.user.displayName)}
                room={this.props.room}
                isMicOn={!(!(this.context.audioStreams[JSON.parse(participant.user.displayName).email] && Object.keys(this.context.audioStreams[JSON.parse(participant.user.displayName).email]).length > 0))}
                streams={streams}
            />
        );
    }

    getVoiceStatus = (status) => {
        if (status)
            return <Typography.Text style={{color: "#58e411", fontWeight: "bold"}}
                                    level={4}>{"Voice Connected"}</Typography.Text>
        else
            return <Typography.Text style={{color: "#e4ab0a", fontWeight: "bold"}}
                                    level={4}>{"Connecting Voice..."}</Typography.Text>
    }

    render() {
        const participants = this.state.participants.map((participant, i) => {
            return this.createParticipant(participant, i === 0);
        });

        return (
            <div style={{padding: "1rem"}}>
                <Typography.Title level={3}>Participants</Typography.Title>
                {this.getVoiceStatus(this.context.isVoiceConnected)}
                <div className="participants-list">{participants}</div>
            </div>
        );
    }
}
