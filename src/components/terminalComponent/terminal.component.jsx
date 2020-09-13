import React from 'react'
import { XTerm } from "xterm-for-react"
import { AttachAddon } from 'xterm-addon-attach';
import {FitAddon} from 'xterm-addon-fit';
import ReconnectingWebSocket from 'reconnecting-websocket';
import cookie from 'react-cookies'
import GlobalContext from '../../context/GlobalContext';


export default class TerminalComponent extends React.Component {

    static contextType = GlobalContext

    constructor(props) {
        super(props);
        if (process.env.REACT_APP_ENV === 'prod') {
            this.state = {
                ws: `wss://${this.props.roomUrl}`,
                http: `https://${this.props.roomUrl}`
            }

        } else {
            this.state = {
                ws: `ws://${this.props.roomUrl}`,
                http: `http://${this.props.roomUrl}`
            }
        }

        this.xtermRef = React.createRef();
    }

    sendPings = (ws) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: "ping"
            }))
            setTimeout(() => {
                this.sendPings(ws)
            }, 8 * 1000)
        }
    }
    
    handleResize = (size) => {
        console.log("Resize")
        console.log(size)
        if (this.fitAddon)
            this.fitAddon.fit()
        if (this.ws && this.ws.readyState === WebSocket.OPEN)
            this.ws.send(JSON.stringify({
                type: "resize",
                payload: this.fitAddon.proposeDimensions()
            }))
    }

    componentDidMount() {
        const terminal = this.xtermRef.current.terminal;

        this.fitAddon = new FitAddon()
        terminal.loadAddon(this.fitAddon)
        this.fitAddon.fit()

        const ws = new ReconnectingWebSocket(`${this.state.ws}?token=${cookie.load('jwt')}`, 'terminal-connect');
        this.ws = ws;

        ws.onopen = () => {
            // Resize terminal
            ws.send(JSON.stringify({
                type: "resize",
                payload: this.fitAddon.proposeDimensions()
            }))

            const attachAddon = new AttachAddon(ws);
            terminal.loadAddon(attachAddon);
            this.context.setWS(ws, this.state.http)
            this.sendPings(ws);
        }

        ws.onclose = () => {
            terminal.write("\n\r\x1B[1;3;31mDisconnected from console!\x1B[0m")
        }
    }

    render() {
        return (
            <XTerm ref={this.xtermRef} className={this.props.className} />
        )
    }
}
