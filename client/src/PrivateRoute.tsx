import React, { useContext, useState, useEffect } from "react";
import { UserContext } from './UserContext';
import { Redirect, Route, RouteProps, Switch } from 'react-router';
import axios from './Axios'



interface PublicRouteProps extends RouteProps {
    // tslint:disable-next-line:no-any
    component: any;
}

const PrivateRoute: React.FC<PublicRouteProps> = ({ component: Component, ...rest }) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [loadingComplete, setLoadingComplete] = useState(false);

    useEffect(
        () => {
            const isLogin = async () => {
                const id = localStorage.getItem('userID');
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        token: token,
                    }
                }
                await axios.post(`security/token/validate`,
                    {
                        userId: id
                    }, config
                ).then(response => {
                    console.log(response.data)
                    if (response.data.result === 'true') {
                        setAuthenticated(true);
                    } else {
                        setAuthenticated(false);
                    }
                }).catch(error => {
                    console.log('Feil ved request av validering ' + error.message)
                })
                setLoadingComplete(true);
            }
            // run login function
            isLogin();
        },
        []
    );

    if (loadingComplete) {
        return (
            <Route {...rest} render={props => (
                authenticated ?
                    <Component {...props} />
                    : <Redirect to="/" />
            )} />
        );
    } else {
        return (<div>Loading</div>)
    }
}

export default PrivateRoute;

