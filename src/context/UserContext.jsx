import React, { Component } from "react";

const UserContext = React.createContext();

class UserProvider extends Component {
    // Context state
    state = {
        user: null,
        domain: null,
        projectData: null,
        audioStreams: {}
    };

    // Method to update state
    setUser = (user) => {
        this.setState({ user });
    };

    setDomain = (domain) => {
        this.setState({ domain });
    };

    setProjectData = (projectData) => {
        this.setState({ projectData });
    };

    dispose = () => {
        this.setState({
            user:null,
            domain: null,
            projectData: null
        })
    }

    setAudioStreams = (streams)=>{
        this.setState({audioStreams: streams})
    }

    render() {
        const { children } = this.props;
        const { user, domain, projectData, audioStreams } = this.state;
        const { setUser, setDomain, setProjectData, dispose, setAudioStreams } = this;

        return (
            <UserContext.Provider
                value={{
                    user,
                    domain,
                    projectData,
                    audioStreams,
                    setUser,
                    setDomain,
                    setProjectData,
                    dispose,
                    setAudioStreams
                }}>
                {" "}
                {children}{" "}
            </UserContext.Provider>
        );
    }
}

export default UserContext;

export { UserProvider };
