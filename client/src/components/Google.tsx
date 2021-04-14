import React, { Component, useState, useEffect } from 'react';
import GoogleLogin from 'react-google-login';
import styled from 'styled-components';
import { useHistory } from 'react-router';


const GoogleContainer = styled.div`
  width: 100%;
  height:50px;
`;

const Google = () =>  {

    const history = useHistory();
    const [email, setEmail] = useState<string>('');
    const [userID, setUserID] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [picture, setPicture] = useState<string>('');
    const [answer, setAnswer] = useState<any>()

    const responseGoogle = async(response: any) => {
        console.log( response.profileObj);
        setAnswer(response.profileObj);
        setEmail(answer.email);
        setUserID(answer.googleId);
        setName(answer.name)
        setPicture(answer.imageUrl);
        console.log(name);
      }


        return (
            <GoogleContainer>
                <GoogleLogin
                    clientId='829161936578-7u42ghop2aqmgs3e4n98907euik21jrt.apps.googleusercontent.com'
                    buttonText='Login with Google'
                    //fields="name,email,picture"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}
                />
            </GoogleContainer>
        )
}

export default Google;
