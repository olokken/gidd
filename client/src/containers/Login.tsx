import React, { ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import LoginCard from '../components/LoginCard';
import { useHistory } from 'react-router-dom';
import image from '../assets/GIDD.png';


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
    border-radius:100px; 
    width:608px; 
    margin-right:70px; 
`;

interface User {
    username:string,
    email:string,
    userID:string,
    name:string,
    picture:string
}

const Login = () => {
    const history = useHistory();
    const [email, setEmail] = useState<string>('');
    const [userID, setUserID] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [picture, setPicture] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [user, setUser] = useState<User>();


    const onLogin = () => {
        if (!checkPassword()) {
            history.push('/HomePage');
        } else {
            alert("Vennligst fyll ut alt")
        }
    };

    const checkPassword = () => {
        if (email !== '' && password !== '') {
            return false;
        }
        return true;
        //TODO legge flere sjekker
    }

    const handleClickShowPassword = () => {
        if (showPassword) {
            setShowPassword(false);
        } else {
            setShowPassword(true);
        }
    }

    const onNewUser = () => {
        history.push('/newUser');
    };

    const onChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
        const currentEmail: string = (event.target as HTMLInputElement).value
        setEmail(currentEmail);
    };

    const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
        const currentPassword: string = (event.target as HTMLInputElement).value
        setPassword(currentPassword);
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Enter') {
            onLogin();
        }
    };


    const responseGoogle = (response: any) => {
        console.log( response.profileObj);
        setEmail(response.profileObj.email);
        setUserID(response.profileObj.id);
        setName(response.profileObj.name);
        setPicture(response.profileObj.picture);
      }

      const responseFacebook =  async(response:any) => {
        console.log(response)
        //setEmail(answer.email)
        //setUserID(answer.userID)
        //setName(answer.name)
        //setPicture(answer.picture.data.url)
    }

    const componentClicked  = () => {
        console.log('clicked')
    }

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
                responseFacebook={responseFacebook}
                componentClicked={componentClicked}
            ></LoginCard>
        </LoginContainer>
    );
};

export default Login;
