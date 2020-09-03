import React from 'react';
import {Route, Switch,} from "react-router-dom";
import { useThemeSwitcher } from "react-css-theme-switcher";
import SignIn from "./pages/sign-in/signIn.page"
import './App.less'
import DarkModeToggle from "react-dark-mode-toggle";
import { Layout,Space} from "antd";
const { Header} = Layout;

const App = () =>{
    const [isDarkMode, setIsDarkMode] = React.useState();
    const { switcher, currentTheme, status, themes } = useThemeSwitcher();
    const toggleTheme = (isChecked) => {
        setIsDarkMode(isChecked);
        switcher({ theme: isChecked ? themes.dark : themes.light });
    };

    // Avoid theme change flicker
    if (status === "loading") {
        return null;
    }
    return (
    <>

        <Space style={{ float: "right", padding: "10px 30px"}}>
            <DarkModeToggle
                onChange={toggleTheme}
                checked={isDarkMode}
                size={80}
            />
        </Space>


    <Switch>
        <Route path='/login'>
            <SignIn/>
        </Route>
    </Switch>

    </>
);}

export default App;