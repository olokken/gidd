import React, { useState, useEffect } from 'react'
import FacebookLogin, { ReactFacebookLoginInfo } from 'react-facebook-login';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import ReactDOM from 'react-dom'
import { setConstantValue } from 'typescript';



const FacebookContainer = styled.div`
  width: 85%;
`;


const FacebookC = () => {
    const history = useHistory();
    const [email, setEmail] = useState<string>('');
    const [userID, setUserID] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [picture, setPicture] = useState<string>('');
    const [answer, setAnswer] = useState<any>()

    const responseFacebook =  async(response:any) => {
        setAnswer(await response)
        //setEmail(answer.email)
        //setUserID(answer.userID)
        //setName(answer.name)
        //setPicture(answer.picture.data.url)
    }


    const componentClicked  = () => {
        console.log('clicked')
    }

    useEffect(() => {
        if(answer !== undefined) {
            console.log(answer)
            history.push('/HomePage')
        }
    })


    return(
        <FacebookLogin
        appId="124734739639594"
        autoLoad={true}
        fields="name,email,picture"
        onClick={componentClicked}
        callback={responseFacebook} />
        )
    };

export default FacebookC;