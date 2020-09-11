import React from "react";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import validator from "validator";
import { Spin, Result, Button, notification } from "antd";
import axios from "axios";
import cookie from "react-cookies";
import UserContext from "../../context/UserContext";

class JoinPage extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);

    this.inviteCode = queryString.parse(this.props.history.location.search);

    axios.defaults.headers.common["x-api-key"] = cookie.load("jwt");
    axios.defaults.headers.common["Content-Type"] =
      "application/x-www-form-urlencoded";
    this.state = {
      isValid: true,
    };
  }

  componentDidMount() {
    console.log("join room");

    this.correctRedirect();
  }

  correctRedirect =  () => {
    this.token = cookie.load("jwt");

    console.log(
      this.context.user, this.token
    );

    if (typeof this.token !== "undefined") {
        console.log('inside correct ');
      this.checkInviteCode(this.inviteCode.inviteCode );
    } else {
      this.props.history.push({
        pathname: "/login",
        state: {
          inviteCode: this.inviteCode,
        },
      });
    }
  };

  checkInviteCode = (inviteCode) => {
    console.log(inviteCode);
    if (
      validator.isUUID(inviteCode) &&
      typeof inviteCode !== "undefined" &&
      typeof this.token !== "undefined"
    ) {
      //send put request and then redirect to workspace
      console.log("check invite");
      axios
        .post(
          `${process.env.REACT_APP_MAIN_SERVER}/rooms/join?inviteCode=${inviteCode}`
        )
        .then((res) => {
            console.log('res herre')
          notification.success({
            message: "Room Joined",
            description: `Room ${res.data.roomName} was joined successfully.`,
          });
          return res.data;
        })
        .then((data) => {
            console.log()
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
            this.props.history.push("/rooms");
          }
          this.setState({ isValid: false });
        });
    } else {
      this.setState({ isValid: false });
    }
  };

  render() {
    return this.state.isValid ? (
      <div>
        <Spin />
      </div>
    ) : (
      <div>
        {" "}
        <Result
          status="404"
          title="Invalid Invite Code"
          extra={
            <Button type="primary" href="/rooms">
              Back to Rooms
            </Button>
          }
        />
      </div>
    );
  }
}

export default withRouter(JoinPage);
