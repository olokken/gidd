import React from 'react';
import { Route, Switch } from 'react-router';
import Navbar from './components/NavBarComponents/NavBar';
import Activities from './containers/Activities';
import Login from './containers/Login';
import Map from './containers/Map';
import NewUser from './containers/NewUser';
import Footer from './components/FooterComponents/Footer';
import Calendar from './containers/Calendar';
import Leaderboard from './containers/Leaderboard';
import GroupsAndFriends from './containers/GroupsAndFriends';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';


export default (
    <Switch>
        <PublicRoute exact path="/" component={Login} />
        <PublicRoute exact path="/newUser" component={NewUser} />
        <div>
            <Navbar></Navbar>
            <PrivateRoute exact path="/Activities" component={Activities} />
            <PrivateRoute exact path="/Map" component={Map} />
            <PrivateRoute exact path="/Calendar" component={Calendar} />
            <PrivateRoute exact path="/Leaderboard" component={Leaderboard} />
            <PrivateRoute exact path="/GroupsAndFriends" component={GroupsAndFriends} />
            <Footer></Footer>
        </div>
    </Switch>
);
