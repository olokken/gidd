import React, { useContext } from "react";
import { UserContext } from './UserContext';
import { Redirect, Route, RouteProps, Switch } from 'react-router';



interface PrivateRouteProps extends RouteProps {
    // tslint:disable-next-line:no-any
    component: any;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ ...rest }) => {
    if (localStorage.getItem('token') === null) return <Redirect to='/' />;
    return <Route {...rest} />;
}

export default PrivateRoute;

