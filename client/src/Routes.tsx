import React from 'react';
import { Route, Switch } from 'react-router';
import Navbar from './components/NavBar';
import CreateActivity from './containers/CreateActivity';
import HomePage from './containers/HomePage';
import Login from './containers/Login';
import Map from './containers/Map';
import NewUser from './containers/NewUser';

export default (
    <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/newUser" component={NewUser} />
        <div>
            <Navbar></Navbar>
            <Route exact path="/HomePage" component={HomePage} />
            <Route exact path="/Map" component={Map} />
            <Route path="/createactivity" component={CreateActivity} />
        </div>
    </Switch>
);
