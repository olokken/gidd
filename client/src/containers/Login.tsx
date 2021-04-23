import React, { ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import LoginCard from '../components/CardComponents/LoginCard';
import { useHistory } from 'react-router-dom';
import image from '../assets/GIDD.png';
import { UserContext } from '../UserContext';
import { useContext } from 'react';
import User from '../interfaces/User';
import axios from '../Axios';

const LoginContainer = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #334d50; /* fallback for old browsers */
    background: -webkit-linear-gradient(
        to right,
        #cbcaa5,
        #334d50
    ); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(
        to right,
        #cbcaa5,
        #334d50
    ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
`;

const StyledLogo = styled.img`
    border-radius: 100px;
    width: 608px;
    margin-right: 70px;
`;

const Login = () => {
    const history = useHistory();
    const [email, setEmail] = useState<string>('');
    const [userID, setUserID] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [surname, setSurname] = useState<string>('');
    const [picture, setPicture] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const { user, setUser } = useContext(UserContext);

    const onLogin = async () => {
        if (!checkPassword() || email !== '') {
            axios
                .post('/login', {
                    provider: 'LOCAL',
                    email: email,
                    password: password,
                })
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                    const id = response.data.id
                    setUser(id);
                    axios.get(`/security/generate/token?subject=${id}`).then(response => {
                        const token = response.data.result;
                        localStorage.setItem('token', token);
                        localStorage.setItem('userID', id);
                    }).then(() => {
                        history.push('/Activities');
                    }).catch(error => {
                        console.log('Feil med token: ' + error.message)
                    })
                })
                .catch((error) => {
                    console.log('error: ' + error.message);
                    alert('Email eller passord er feil');
                });
        } else {
            alert('Vennligst fyll ut alt');
        }
    };

    const checkPassword = () => {
        if (email !== '' && password !== '') {
            return false;
        }
        return true;
        //TODO legge flere sjekker
    };

    const handleClickShowPassword = () => {
        if (showPassword) {
            setShowPassword(false);
        } else {
            setShowPassword(true);
        }
    };

    const onNewUser = () => {
        history.push('/newUser');
    };

    const onChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
        const currentEmail: string = (event.target as HTMLInputElement).value;
        setEmail(currentEmail);
    };

    const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
        const currentPassword: string = (event.target as HTMLInputElement)
            .value;
        setPassword(currentPassword);
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Enter') {
            onLogin();
        }
    };

    const responseGoogle = (response: any) => {
        const answer = response;
        console.log(answer);
        const accessToken = response.tokenId;
        console.log('fått svar');
        axios.post('/login', {
            provider: 'GOOGLE',
            accessToken: accessToken,
            email: response.profileObj.email,
            firstName: response.profileObj.givenName,
            surname: response.profileObj.familyName,
            id: response.profileObj.googleID
        }).then(response => {
            console.log(response)
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userID', response.data.userId);
            setUser(response.data.userId);
        }).then(() => {
            setUser(response.data.userId);
            history.push('/Activities');
        }).catch(error => {
            console.log(error);
        })
    };

    const failureGoogle = (response: any) => {
        console.log(response);
    };

    const responseFacebook = (response: any) => {
        console.log(response);
        const name: string[] = response.name.split(' ');
        const accessToken = response.accessToken;
        axios.post('/login', {
            provider: "FACEBOOK",
            accessToken: accessToken,
            email: response.email,
            firstName: name[0],
            surname: name[1],
        }).then(response => {
            if (response.data.error) {
                console.log(response.data.error)
            } else {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userID', response.data.userId);
            }
            setUser(response.data.userId);
        }).then(() => {
            setUser(response.data.userId);
            history.push('/Activities');
        }).catch(error => {
            console.log(error.message);
        })
    };

    const componentClicked = async () => {
        console.log();
    };

    return (
        <LoginContainer>
            <StyledLogo src={image}></StyledLogo>
            <LoginCard
                onLogin={onLogin}
                onChangeEmail={onChangeEmail}
                onChangePassword={onChangePassword}
                onKeyDown={onKeyDown}
                onNewUser={onNewUser}
                handleClickShowPassword={handleClickShowPassword}
                showPassword={showPassword}
                responseGoogle={responseGoogle}
                failureGoogle={failureGoogle}
                responseFacebook={responseFacebook}
                componentClicked={componentClicked}
            ></LoginCard>
        </LoginContainer>
    );
};

export default Login;
