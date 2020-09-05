import React from 'react'
import UserContext from '../../context/UserContext'
import { Convergence } from "@convergence/convergence";
import SplitPane from 'react-split-pane';
import EditorGoupComponent from "./editorGroup.component"
import ChatComponent from '../../components/chatComponent/chat.component'
import { Spin,Col,Row } from 'antd'
import TerminalComponent from '../../components/terminalComponent/terminal.component'
import FileManagerComponent from "./fileManager.component"
import ParticipantsList from '../../components/participantsList/participantsList.component'
import RoomInfo from '../../components/roomInfo/roomInfo.component'
import { withRouter } from 'react-router-dom';

class WorkspacePage extends React.Component {

  static contextType = UserContext

  constructor(props) {
    super(props)
    // Temp
    this.room = { name: "temproom", id: "2233" }
    this.inviteCode = '84f2d307-b867-410c-a28e-a49fbd379112'
    this.domainUrl = process.env.REACT_APP_DOMAIN_URL;
    this.state = {
      domain: null,
      projectData: null,
      isLoading: true,
      roomUrl: 'rooms.localhost/84f2d307-b867-410c-a28e-a49fbd379112'
    }

  }


  componentDidMount() {
    // const data = this.props.history.location.state
    // console.log(this.props)
    const { user} = this.context
    // console.log(user)
    this.tryAutoLogin(user)
  }


  tryAutoLogin = (user) => {

    if (user) {
      // console.log(user)
      Convergence.connectAnonymously(this.domainUrl, JSON.stringify(user)).then(
        (d) => {
          // console.log(d)
          this.setState({ domain: d });
          this.context.setDomain(d)
          this.createOrJoinProject(d)
        }
      );
    } else {
      this.props.history.push("/login")
    }

  };


  createOrJoinProject = (domain) => {
    domain.models()
      .openAutoCreate({
        id: this.room.id,
        collection: "executeit",
        ephemeral: true,
        data: {
          "name": this.room.name,
          "tree": {
            "nodes": {
              "root": {
                "name": this.room.name,
                "children": []
              }
            }
          }
        }
      })
      .then((model) => {
        console.log("project model open");
        // use the model
        this.openProject(model)
      })
      .catch((error) => {
        console.log("Could not open the project model", error);
      });
  }


  openProject = (projectModel) => {

    const domain = this.state.domain;

    let activity = null;
    let chatRoom = null;

    Promise.all([
      domain
        .activities()
        .join(projectModel.modelId())
        .then((a) => (activity = a)),
      domain
        .chat()
        .create({
          id: projectModel.modelId(),
          type: "room",
          membership: "public",
          ignoreExistsError: true,
        })
        .then((channelId) => domain.chat().join(channelId))
        .then((c) => (chatRoom = c)),
    ])
      .then(() => {
        const projectData = {
          projectModel,
          activity,
          chatRoom,
          user: projectModel.session().user(),
        };
        this.setState({ projectData });
        console.log(this.state.projectData, '11lkjasl');
        this.context.setProjectData(projectData)
      })
      .then(() => { this.setState({ isLoading: false }) })
      .catch((e) => {
        console.error(e);
      });
  }



  render() {
    const loading = this.state.isLoading
    return (<div>
      {
        loading ?
          <div>    <Spin size="large" />
          </div> :
          <div>
            <SplitPane
              split="vertical"
              minSize="70vw"
            >
              <div>
                <Row>
                  <Col span={6} style={{borderRight: "2px solid #505050"}} >
                    <FileManagerComponent rtModel={this.context.projectData.projectModel} />
                  </Col>
                  <Col span={18} style={{    height: "calc(100vh - 64px)"
}}>
                    <EditorGoupComponent rtModel={this.context.projectData.projectModel} />

                  </Col>
                </Row>
              </div>
              <div>
                <SplitPane
                  split='horizontal'
                  minSize="40vh"
                  allowResize={false}
                >
                  <div>
                    <SplitPane allowResize={false} split="vertical" minSize="50%">
                      <ParticipantsList activity={this.context.projectData.activity} />
                      <RoomInfo roomName={this.room.name} inviteCode={this.inviteCode} />
                    </SplitPane>
                  </div>
                  <div><TerminalComponent roomUrl={this.state.roomUrl} /></div>

                </SplitPane>
              </div>
            </SplitPane>
            <ChatComponent
              style={{ zIndex: '100000' }}
              chatRoom={this.context.projectData.chatRoom}
              domain={this.context.domain}
              user={this.context.projectData.user}
            />



          </div>
      }


    </div>



    )
  }
}


export default withRouter(WorkspacePage)