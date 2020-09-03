import React, {useEffect} from 'react';
import {Route, Switch,} from "react-router-dom";
import {useThemeSwitcher} from "react-css-theme-switcher";
import SignIn from "./pages/sign-in/signIn.page"
import './App.less'
import DarkModeToggle from "react-dark-mode-toggle";
import {Space} from "antd";
import {reactLocalStorage} from 'reactjs-localstorage';
import Callback from "./pages/callback/callback.page";
import HomepageComponent from "./pages/homepage/homepage.component";
const App = () => {
    useEffect(async () => {
        const dark = await reactLocalStorage.get('theme', 'light') !== 'light';
        setIsDarkMode(dark)
        await switcher({theme: dark ? themes.dark : themes.light});
    }, [])

    const {switcher, status, themes} = useThemeSwitcher();

    const [isDarkMode, setIsDarkMode] = React.useState()

    const toggleTheme = (isChecked) => {
        setIsDarkMode(isChecked);
        reactLocalStorage.set('theme',isChecked?'dark':'light')
        switcher({theme: isChecked ? themes.dark : themes.light});
    };

    // Avoid theme change flicker
    if (status === "loading") {
        return null;
    }



    return (
        <>

            <Space style={{float: "right", padding: "10px 30px"}}>
                <DarkModeToggle
                    onChange={toggleTheme}
                    checked={isDarkMode}
                    size={80}
                />
            </Space>


            <Switch>
                <Route exact path='/'>
                    <HomepageComponent/>
                </Route>
                <Route exact path='/login'>
                    <SignIn/>
                </Route>
                <Route exact path='/callback'>
                    <Callback/>
                </Route>
            </Switch>

        </>
    );
}

export default App;