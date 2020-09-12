import React from 'react'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string';
import validator from 'validator';
import { Spin, Result, Button, notification } from 'antd'
import axios from 'axios'
import cookie from 'react-cookies'

class JoinPage extends React.Component {
  constructor(props) {
    super(props)
    axios.defaults.headers.common['x-api-key'] = cookie.load('jwt')
    axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
    this.state = {
      status: 'loading'
    }
  }

  componentDidMount() {
    this.checkInviteCode(queryString.parse(this.props.history.location.search).inviteCode);
  }

  checkInviteCode = async (inviteCode) => {

    if (validator.isUUID(inviteCode)) {
      //send put request and then redirect to workspace

      await axios.post(`${process.env.REACT_APP_MAIN_SERVER}/rooms/join?inviteCode=${inviteCode}`)
          .then(res => {
            notification.success({
              message: 'Room Joined',
              description:
                  `Room ${res.data.roomName} was joined successfully.`,
            });
            return res.data
          })
          .then(data => {
            this.props.history.push({
              pathname: '/workspace',
              state:
                  {
                    roomName: data.roomName,
                    inviteCode: data.inviteCode,
                    roomId: data.roomId
                  }
            })
          })
          .catch((e) => {
            console.log(e.response.status)
            if (e.response.data.status === 'already_joined') {
              notification.warning({
                message: 'Room Already Joined',
                description:
                    `You have already joined the room, find your room in my rooms section and click on enter button`,
              });
              this.props.history.push('/rooms')
            }else if(e.response.status === 401){
              //not signed in
                notification.warning({
                    message: 'Please Login First',
                    description:
                        `You are not logged in, please login first and then revisit the link`,
                });
                this.setState({status: "login"})
            }else{
                //invalid invite code
              this.setState({ status: "invalid" })
            }
          })

    } else {
      this.setState({ isValid: false })
    }

  }

  render() {
      if(this.state.status==='invalid'){
          return (
                  <div>
                      <Result
                      status="404"
                      title="Invalid Invite Code"
                      extra={<Button type="primary" href="/rooms">Back to Rooms</Button>}
                  />
                  </div>
          )
      }else if(this.state.status === 'login'){
          return(
              <div>
                  <Result
                      status="401"
                      title="Please Login First"
                      description="You are not logged in, please login first and then revisit the link"
                      extra={<Button type="primary" href="/login">Login</Button>}
                  />
              </div>
          )

      }else{
          return (<div><Spin /></div>)
      }

  }
}

export default withRouter(JoinPage)