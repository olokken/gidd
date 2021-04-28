import React, { ChangeEvent, KeyboardEventHandler } from 'react';
import { TextField, Button, InputAdornment } from '@material-ui/core';
import styled from 'styled-components';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import GoogleLogin from 'react-google-login';
import FacebookLogin, { ReactFacebookLoginInfo } from 'react-facebook-login';
import GoogleButton from 'react-google-button';

const LoginCardContainer = styled.div`
    width: 30rem;
    height: 28rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #fff;
    padding: 3rem;
    border-radius: 8px;
`;

const FacebookContainer = styled.div`
    width: 100%;
`;

const GoogleContainer = styled.div`
    width: 100%;
    border: 1 rem;
`;

const SocialMediaContainer = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    margin-top: 15px;
`;

interface Props {
    onLogin: () => void;
    onNewUser: () => void;
    onChangeEmail: (e: ChangeEvent<HTMLInputElement>) => void;
    onChangePassword: (e: ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: any) => void;
    handleClickShowPassword: () => void;
    showPassword: boolean;
    responseGoogle: (response: any) => void;
    failureGoogle: (response: any) => void;
    responseFacebook: (response: any) => void;
    componentClicked: (data: any) => void;
}

const LoginCard = ({
    onLogin,
    onNewUser,
    onChangeEmail,
    onChangePassword,
    onKeyDown,
    handleClickShowPassword,
    showPassword,
    responseGoogle,
    failureGoogle,
    responseFacebook,
    componentClicked,
}: Props) => {
    return (
        <LoginCardContainer>
            <h2>LOGG INN</h2>
            <TextField
                style={{ width: '100%', marginBottom: 24 }}
                label="E-mail"
                color="secondary"
                onChange={onChangeEmail}
                variant="outlined"
                onKeyDown={onKeyDown}
            />
            <TextField
                label="Passord"
                variant="outlined"
                color="secondary"
                style={{ width: '100%', marginBottom: 24 }}
                type={!showPassword ? 'password' : 'text'}
                onChange={onChangePassword}
                onKeyDown={onKeyDown}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleClickShowPassword}>
                                {showPassword ? (
                                    <Visibility />
                                ) : (
                                    <VisibilityOff />
                                )}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <Button
                style={{ width: '100%', height: '50px' }}
                variant="contained"
                color="primary"
                onClick={onLogin}
            >
                LOGG IN
            </Button>
            <Button
                style={{ width: '100%', marginTop: '15px', height: '50px' }}
                variant="contained"
                color="primary"
                onClick={onNewUser}
            >
                LAG NY BRUKER{' '}
            </Button>
            <SocialMediaContainer>
                <FacebookContainer>
                    <FacebookLogin
                        appId="124734739639594"
                        autoLoad={false}
                        fields="name,email,picture"
                        onClick={componentClicked}
                        callback={responseFacebook}
                        textButton="FACEBOOK LOGIN"
                    />
                </FacebookContainer>
                <GoogleContainer>

                    <GoogleLogin
                        clientId="829161936578-7u42ghop2aqmgs3e4n98907euik21jrt.apps.googleusercontent.com"
                        render={(renderProps) => (
                            <GoogleButton
                                onClick={renderProps.onClick}
                                type="light"
                                label="GOOGLE LOGIN"
                                style={{
                                    width: '95%',
                                    minHeight: '100%',
                                    maxHeight: '100%',
                                    fontSize: '15px',
                                    border: '1px',
                                }}
                                disabled={renderProps.disabled}
                            />
                        )}
                        autoLoad={false}
                        onSuccess={responseGoogle}
                        onFailure={failureGoogle}
                    />
                </GoogleContainer>
            </SocialMediaContainer>
        </LoginCardContainer>
    );
};

export default LoginCard;
