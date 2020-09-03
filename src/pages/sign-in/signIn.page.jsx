import React from 'react'
import ReactHtmlParser from 'react-html-parser';

import {Card, Col, Row, Space, Typography} from 'antd';
import GoogleButton from 'react-google-button'
import './signIn.styles.css'

const {Title} = Typography;

// import v from "../../assets/video.mp4"
class SignIn extends React.Component {
    url = process.env.REACT_APP_MAIN_SERVER + "/auth/google"

    constructor() {
        super()
        this.state = {
            windowObjectReference: null,
            previousUrl: null,
        }

    }

    openSignInWindow = (url, name) => {
        // remove any existing event listeners
        window.removeEventListener('message', this.receiveMessage);

        // window features
        const strWindowFeatures =
            'toolbar=no, menubar=no, width=600, height=700, top=100, left=600';

        if (this.state.windowObjectReference === null || this.state.windowObjectReference.closed) {
            /* if the pointer to the window object in memory does not exist
             or if such pointer exists but the window was closed */
            this.setState({windowObjectReference: window.open(url, name, strWindowFeatures)});
        } else if (this.state.previousUrl !== url) {
            /* if the resource to load is different,
             then we load it in the already opened secondary window and then
             we bring such window back on top/in front of its parent window. */
            this.setState({windowObjectReference: window.open(url, name, strWindowFeatures)});
            this.state.windowObjectReference.focus();
        } else {
            /* else the window reference must exist and the window
             is not closed; therefore, we can bring it back on top of any other
             window with the focus() method. There would be no need to re-create
             the window or to reload the referenced resource. */
            this.state.windowObjectReference.focus();
        }

        // add the listener for receiving a message from the popup
        window.addEventListener('message', event => this.receiveMessage(event), false);
        // assign the previous URL
        this.setState({previousUrl: url});
    };


    receiveMessage = event => {
        // Do we trust the sender of this message? (might be
        // different from what we originally opened, for example).

        // if (event.origin !== BASE_URL) {
        //   return;
        // }

        const {data} = event;
        // if we trust the sender and the source is our popup
        // get the URL params and redirect to our server to use Passport to auth/login

        const {payload} = data;
        //   const redirectUrl = `/auth/google/login${payload}`;
        //   window.location.pathname = redirectUrl;

    };

    render() {
        return (

            <div id="homepage">

                <Card id="login-card" bordered={false}>
                    <Row justify="center" align="middle">
                        <Col span={24}>
                            <Title>Execute It</Title>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={16}>
                            <div>{ReactHtmlParser(`                            <lottie-player src="https://assets1.lottiefiles.com/packages/lf20_sFBr0l/snscit.json"  background="transparent"  speed="1"  style="width: 600px; height: 600px;"  loop autoplay></lottie-player>

`)}</div>

                        </Col>
                        <Col span={8} style={{position: 'relative'}}>
                            <div style={{textAlign: 'center', position: 'absolute',top: '38%',transform: 'translateY(-50%)'}}>
                                <h2><em style={{fontSize: '150%'}}>Realtime Code Collabration Platform</em> </h2>
                                <br/><br/><br/>
                                <Space align="end"> <GoogleButton onClick={() => {
                                    this.openSignInWindow(this.url, 'Sign In')
                                }}/>
                                </Space>
                            </div>



                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}

export default SignIn