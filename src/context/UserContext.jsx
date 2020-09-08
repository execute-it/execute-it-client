import React, { Component } from "react";

const UserContext = React.createContext();

class UserProvider extends Component {
    // Context state
    state = {
        user: null,
        domain: null,
        projectData: null,
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

    render() {
        const { children } = this.props;
        const { user, domain, projectData } = this.state;
        const { setUser, setDomain, setProjectData, dispose } = this;

        return (
            <UserContext.Provider
                value={{
                    user,
                    domain,
                    projectData,
                    setUser,
                    setDomain,
                    setProjectData,
                    dispose
                }}>
                {" "}
                {children}{" "}
            </UserContext.Provider>
        );
    }
}

export default UserContext;

export { UserProvider };
