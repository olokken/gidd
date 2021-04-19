import React from 'react';
import { Route, Switch } from 'react-router';
import Navbar from './components/NavBar/NavBar';
import Activities from './containers/Activities';
import Login from './containers/Login';
import Map from './containers/Map';
import NewUser from './containers/NewUser';
<<<<<<< HEAD
import Footer from './components/Footer/Footer';
import Calendar from './containers/Calendar';
=======
import Footer from './components/Footer'
import Calender from './containers/Calender'
>>>>>>> dc0d5c81251d13458b163f645a2ea990261f0086

export default (
    <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/newUser" component={NewUser} />
        <div>
            <Navbar></Navbar>
            <Route exact path="/Activities" component={Activities} />
            <Route exact path="/Map" component={Map} />
<<<<<<< HEAD
            <Route exact path="/Calendar" component={Calendar} />
=======
            <Route exact path="/Calender" component={Calender}/>
>>>>>>> dc0d5c81251d13458b163f645a2ea990261f0086
            <Footer></Footer>
        </div>
    </Switch>
);
