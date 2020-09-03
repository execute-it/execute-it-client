import React from 'react';
import {Route, Switch,} from "react-router-dom";
import {useThemeSwitcher} from "react-css-theme-switcher";
import SignIn from "./pages/sign-in/signIn.page"
import './App.less'
import DarkModeToggle from "react-dark-mode-toggle";
import {Space} from "antd";
import {reactLocalStorage} from 'reactjs-localstorage';


const App = () => {

    const {switcher, status, themes} = useThemeSwitcher();

    const [isDarkMode, setIsDarkMode] = React.useState( async ()=>{
         const dark = await reactLocalStorage.get('theme', 'light') !== 'light';
        await switcher({theme: dark ? themes.dark : themes.light});
        return dark
    })

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
                <Route path='/login'>
                    <SignIn/>
                </Route>
            </Switch>

        </>
    );
}

export default App;