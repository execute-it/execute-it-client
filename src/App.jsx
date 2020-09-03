import React, { useEffect, useContext } from 'react';
import { Route, Switch, } from "react-router-dom";
import { useThemeSwitcher } from "react-css-theme-switcher";
import SignIn from "./pages/sign-in/signIn.page"
import './App.less'
import DarkModeToggle from "react-dark-mode-toggle";
import { Space, Layout } from "antd";
import { reactLocalStorage } from 'reactjs-localstorage';
import Callback from "./pages/callback/callback.page";
import WorkspacePage from "./pages/editor/workspace.page";
import RoomPage from './pages/rooms/rooms.page';
import UserContext from './context/UserContext';
import cookie from 'react-cookies'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import TestPage from './pages/test/test.page'
const App = (props) => {

    const userContext = useContext(UserContext)

    useEffect(async () => {
        const dark = await reactLocalStorage.get('theme', 'light') !== 'light';
        await checkCookie()
        setIsDarkMode(dark)
        await switcher({ theme: dark ? themes.dark : themes.light });
    }, [])

    const checkCookie = async () => {
        const token = await cookie.load('jwt')

        if(props.history.location.pathname === '/login')
            return

        if (token) {
            //verify token
            axios.get(`${process.env.REACT_APP_MAIN_SERVER}/auth/verify`, {
                headers: {
                    'x-api-key': token
                }
            })
                .then((res) => {
                    //if successfull then store user details in global state
                    console.log(res.data)
                    userContext.setUser(res.data)
                })
                .catch(() => {
                    props.history.push('/login')
                })
        } else {
            props.history.push('/login')
        }
    }

    const { switcher, status, themes } = useThemeSwitcher();

    const [isDarkMode, setIsDarkMode] = React.useState()

    const toggleTheme = (isChecked) => {
        setIsDarkMode(isChecked);
        reactLocalStorage.set('theme', isChecked ? 'dark' : 'light')
        switcher({ theme: isChecked ? themes.dark : themes.light });
    };

    // Avoid theme change flicker
    if (status === "loading") {
        return null;
    }



    return (
        <>
                {/* <Space>
                    <DarkModeToggle
                        onChange={toggleTheme}
                        checked={isDarkMode}
                        size={80}
                    />
                </Space> */}
            <Switch>
                <Route exact path='/rooms'>
                    <RoomPage />
                </Route>
                <Route exact path='/test'>
                    <TestPage/>
                </Route>
                <Route exact path='/login'>
                    <SignIn />
                </Route>
                <Route exact path='/callback'>
                    <Callback />
                </Route>
                <Route exact path='/workspace'>
                    <WorkspacePage />
                </Route>
            </Switch>

        </>
    );
}

export default withRouter(App);