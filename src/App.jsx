import React from 'react';
import {Route, Switch, withRouter} from "react-router-dom";
import SignIn from "./pages/sign-in/signIn.page"
import './App.less'

const App = () => (
    <Switch>
        <Route path='/login'>
            <SignIn/>
        </Route>
    </Switch>
);

export default App;