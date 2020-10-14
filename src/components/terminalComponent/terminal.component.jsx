import React from 'react'
import {Terminal} from 'xterm';
import {AttachAddon} from 'xterm-addon-attach';
import {FitAddon} from 'xterm-addon-fit';
import ReconnectingWebSocket from 'reconnecting-websocket';
import cookie from 'react-cookies'
import GlobalContext from '../../context/GlobalContext';
import 'xterm/css/xterm.css'

export default class TerminalComponent extends React.Component {

    static contextType = GlobalContext

    constructor(props) {
        super(props);
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
        // console.log("Resize")
        // console.log(size)
        if (this.fitAddon)
            this.fitAddon.fit()
        if (this.ws && this.ws.readyState === WebSocket.OPEN)
            this.ws.send(JSON.stringify({
                type: "resize",
                payload: this.fitAddon.proposeDimensions()
            }))
    }

    componentDidMount() {
        const termOptions = {
            convertEol: true,
            cursorBlink: true
        }
        const terminal = new Terminal(termOptions);

        terminal.open(this.xtermRef)

        this.fitAddon = new FitAddon()
        terminal.loadAddon(this.fitAddon)
        this.fitAddon.fit()

        terminal.onResize((size) => {
            // console.log("Resize")
        })

        new ResizeObserver(this.handleResize).observe(this.xtermRef)

        const ws = new ReconnectingWebSocket(`${process.env.REACT_APP_MAIN_SERVER_WS}?roomId=${this.props.roomId}&token=${cookie.load('jwt')}`, 'terminal-connect');
        this.ws = ws;
        this.context.setWS(ws)

        ws.onopen = () => {
            // Resize terminal
            ws.send(JSON.stringify({
                type: "resize",
                payload: this.fitAddon.proposeDimensions()
            }))

            const attachAddon = new AttachAddon(ws);
            terminal.loadAddon(attachAddon);
            this.sendPings(ws);
        }

        ws.onclose = () => {
            terminal.write("\n\r\x1B[1;3;31mDisconnected from console!\x1B[0m")
        }
    }

    render() {
        return (
            <div ref={r => this.xtermRef = r} style={{width: "100%", height: "100%"}}
                 className={"this.props.className"}/>
        )
    }
}