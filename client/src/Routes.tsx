import React from 'react';
import { Route, Switch } from 'react-router';
import Navbar from './components/NavBarComponents/NavBar';
import Activities from './containers/Activities';
import Login from './containers/Login';
import Map from './containers/Map';
import NewUser from './containers/NewUser';
import Footer from './components/FooterComponents/Footer'; 
import Calendar from './containers/Calendar';

export default (
    <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/newUser" component={NewUser} />
        <div>
            <Navbar></Navbar>
            <Route exact path="/Activities" component={Activities} />
            <Route exact path="/Map" component={Map} />
            <Route exact path="/Calendar" component={Calendar} />
            <Footer></Footer>
        </div>
    </Switch>
);
