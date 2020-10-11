import React from 'react';
import {Avatar, Popover, Space, Typography} from 'antd'
import VoiceChatMainComponent from "../voiceChannel/voiceChatMain.component";
import {AudioMutedOutlined, AudioOutlined} from "@ant-design/icons";
import SoundMeter from "../../utils/SoundMeter";

const {Text} = Typography

const menu = (props) =>
{
    const data = JSON.parse(props)

    return (
        <Text>{data.email}</Text>
    )

}

const title = (props) =>
{
    const data = JSON.parse(props)
    return (
        <Space size='large'>
            <Avatar style={{borderWidth: 4, borderColor: props.color, borderStyle: 'solid'}} size={45}
                    src={data.image}/>
            <Typography.Text>{data.displayName}</Typography.Text>
        </Space>
    )

}

class Participant extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            border: 4
        }
    }

    getAvgVolumeLevel = (soundMeters)=>{
        let totalLevel = 0.000;
        soundMeters.forEach(soundMeter=>{
            totalLevel += parseFloat(soundMeter.volume.toFixed(1)) * 20
        })
        // Restrict value betn 2 and 6
        return Math.max(2, Math.min(totalLevel, 6))
    }

    componentDidUpdate(prevProps, prevStates, ss) {
        if(this.props !== prevProps) {
            if(this.interval) {
                clearInterval(this.interval)
            }
            try {
                if (this.props.streams) {
                    // Getting multiple streams here, avg. or add their volume
                    let soundMeters = []
                    for(let i in this.props.streams){
                        const stream = this.props.streams[i].audio
                        window.AudioContext = window.AudioContext || window.webkitAudioContext;
                        let audioContext = new AudioContext();
                        let soundMeter = new SoundMeter(audioContext);
                        soundMeter.connectToSource(stream);
                        soundMeters.push(soundMeter)
                    }
                    this.interval = setInterval(() => {
                        // console.log("Volume:", soundMeter.volume.toFixed(2))
                        this.setState({border: this.getAvgVolumeLevel(soundMeters)})
                    }, 100)
                }
            } catch (e) {
                console.error(e)
            }
        }
    }

    componentWillUnmount() {
        if(this.interval)
            clearInterval(this.interval)
    }

    render() {
        const border = this.props.isMicOn ? this.state.border : 4;

        const username = JSON.stringify({
            username: JSON.parse(this.props.displayName).email,
            sessionId: `${Math.random()}`
        })

        return (
            <div style={{marginTop: '1rem'}}>
                <Popover content={() => (menu(this.props.displayName))} placement='left'
                         title={() => (title(this.props.displayName))}>
                    <Space>
                        <Avatar style={{borderWidth: border, borderColor: this.props.color, borderStyle: 'solid'}} size={45}
                                src={JSON.parse(this.props.displayName).image}/>
                        <Typography.Text>{JSON.parse(this.props.displayName).displayName}</Typography.Text>
                        {this.props.isSelf &&
                        <VoiceChatMainComponent username={username}
                                                roomId={this.props.room.id}/>}
                        {!this.props.isSelf && (this.props.isMicOn ? <AudioOutlined/> : <AudioMutedOutlined/>)}
                    </Space>
                </Popover>
            </div>

        );
    }
};

export default Participant;
