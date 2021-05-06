import React, { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import LoginCard from '../components/CardComponents/LoginCard';
import { useHistory } from 'react-router-dom';
import image from '../assets/GIDD.png';
import { UserContext } from '../UserContext';
import { useContext } from 'react';
import axios from '../Axios';

const LoginContainer = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #334d50; /* fallback for old browsers */
    background: -webkit-linear-gradient(
        to bottom,
        #1d4350, #a43931
    ); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(
        to bottom,
        #1d4350, #a43931
    ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
`;

const StyledLogo = styled.img`
    border-radius: 100px;
    width: 608px;
    margin-right: 70px;
`;

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

const Login = () => {
    const history = useHistory();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const {setUser } = useContext(UserContext);
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

    const onLogin = async () => {
        if (!checkPassword() || email !== '') {
            axios
                .post('/login', {
                    provider: 'LOCAL',
                    email: email,
                    password: password,
                })
                .then((response) => {
                    console.log(response.data);
                    const id = response.data.id
                    const token = response.data.token
                    setUser(id);
                    localStorage.setItem('token', token);
                    localStorage.setItem('userID', id);
                    console.log('Fikk logget inn')
                }).then(() => {
                    window.location.reload()
                    history.push('/Activities');
                })
                .catch((error) => {
                    console.log(error.response.data);
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
            history.push('/Activities');
        }).catch(error => {
            console.log(error.message);
        })
    };

    const componentClicked = async () => {
        console.log();
    };

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <LoginContainer>
            {
                windowDimensions.width > 951 &&
                <StyledLogo src={image}></StyledLogo>
            }
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
