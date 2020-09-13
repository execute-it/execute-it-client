import React from "react";
import { withRouter } from "react-router-dom";
import cookie from "react-cookies";
import { Card, Col, Row, Space, Typography } from "antd";
import GoogleButton from "react-google-button";
import "./signIn.styles.css";
import data from "../../assets/snscit.json";
import { Player } from "@lottiefiles/react-lottie-player";

const queryString = require("query-string");

const { Title } = Typography;

// import v from "../../assets/video.mp4"
class SignIn extends React.Component {
  url = process.env.REACT_APP_MAIN_SERVER + "/auth/google";

  constructor(props) {
    super(props);
    this.state = {
      windowObjectReference: null,
      previousUrl: null,
    };
  }

  openSignInWindow = (url, name) => {
    // remove any existing event listeners
    window.removeEventListener("message", this.receiveMessage);

    // window features
    const strWindowFeatures =
      "toolbar=no, menubar=no, width=600, height=700, top=100, left=600";

    if (
      this.state.windowObjectReference === null ||
      this.state.windowObjectReference.closed
    ) {
      /* if the pointer to the window object in memory does not exist
             or if such pointer exists but the window was closed */
      this.setState({
        windowObjectReference: window.open(url, name, strWindowFeatures),
      });
    } else if (this.state.previousUrl !== url) {
      /* if the resource to load is different,
             then we load it in the already opened secondary window and then
             we bring such window back on top/in front of its parent window. */
      this.setState({
        windowObjectReference: window.open(url, name, strWindowFeatures),
      });
      this.state.windowObjectReference.focus();
    } else {
      /* else the window reference must exist and the window
             is not closed; therefore, we can bring it back on top of any other
             window with the focus() method. There would be no need to re-create
             the window or to reload the referenced resource. */
      this.state.windowObjectReference.focus();
    }

    // add the listener for receiving a message from the popup
    window.addEventListener(
      "message",
      (event) => this.receiveMessage(event),
      false
    );
    // assign the previous URL
    this.setState({ previousUrl: url });
  };

  receiveMessage = async (event) => {
    console.log(event);
    const { data } = event;
    if (data.source !== "react-devtools-bridge") {
      const token = await queryString.parse(data).token;
      console.log(data);
      await cookie.save("jwt", token, { path: "/" });
      window.location.replace("/rooms");
    }
  };

  render() {
    return (
      <Row justify="center" align="middle" style={{ marginTop: "48vh" }}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Card id="login-card" bordered={false}>
            <Row justify="center" align="middle">
              <Col
                style={{ marginLeft: "3rem", marginTop: "1rem" }}
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}>
                <Title>{`< Execute It />`}</Title>
              </Col>
            </Row>

            <Row justify="center">
              <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                <Player
                  autoplay
                  loop
                  src={data}
                  style={{ height: "80%", width: "80%" }}></Player>
              </Col>

              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={8}
                style={{
                  textAlign: "center",
                }}>
                <Row justify="center">
                  <Col xs={24}>
                    <div style={{ padding: "5%" }}>
                      <h2
                        style={{
                          //   color: "white",
                          fontStyle: "italic",
                          fontWeight: "bold",
                          letterSpacing: "3px",
                          fontSize: "260%",
                        }}>
                        <em>{`Realtime Code Collaboration Platform`}</em>
                      </h2>
                    </div>
                    <br />
                  </Col>
                </Row>

                <Row justify="center">
                  <Col xs={24}>
                    <Space align="end">
                      {" "}
                      <GoogleButton
                        onClick={() => {
                          this.openSignInWindow(this.url, "Sign In");
                        }}
                      />
                    </Space>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default withRouter(SignIn);
