import React, {Component} from "react";

const UserContext = React.createContext();

class UserProvider extends Component {
    // Context state
    state = {
        user: null,
        domain: null,
        projectData: null,
        audioStreams: {},
        isVoiceConnected: false
    };

    // Method to update state
    setUser = (user) => {
        this.setState({user});
    };

    setDomain = (domain) => {
        this.setState({domain});
    };

    setProjectData = (projectData) => {
        this.setState({projectData});
    };

    dispose = () => {
        this.setState({
            user: null,
            domain: null,
            projectData: null
        })
    }

    setAudioStreams = (streams) => {
        this.setState({audioStreams: streams})
    }

    setVoiceConnected = (isVoiceConnected) => {
        this.setState({isVoiceConnected})
    }

    render() {
        const {children} = this.props;
        const {user, domain, projectData, audioStreams, isVoiceConnected} = this.state;
        const {setUser, setDomain, setProjectData, dispose, setAudioStreams, setVoiceConnected} = this;

        return (
            <UserContext.Provider
                value={{
                    user,
                    domain,
                    projectData,
                    audioStreams,
                    isVoiceConnected,
                    setUser,
                    setDomain,
                    setProjectData,
                    dispose,
                    setAudioStreams,
                    setVoiceConnected
                }}>
                {" "}
                {children}{" "}
            </UserContext.Provider>
        );
    }
}

export default UserContext;

export {UserProvider};
