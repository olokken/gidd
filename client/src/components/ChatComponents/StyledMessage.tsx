import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import User from '../../interfaces/User';
import { UserContext } from '../../UserContext';

interface Props {
    message: string;
    name: string;
    userId: string;
    time: number;
}

const SendtMessage = styled.p`
    position: left;
    float: left;
    width: 50%;
    height: relative;
    padding: 5px;
    background-color: primary;
    margin: 3px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
`;

const RecievedMessage = styled.p`
    position: left;
    float: right;
    width: 50%;
    height: relative;
    padding: 5px;
    background-color: none;
    margin: 3px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
`;



const StyledMessage = ({ message, userId, time, name }: Props) => {
    const [isRecieved, setIsRecieved] = useState<boolean>(true);
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (userId == user) setIsRecieved(false);
        else setIsRecieved(true);
    }, []);

    const MessageStyle = isRecieved ? (
        <RecievedMessage>
            <legend>{name}</legend>
            {message}
        </RecievedMessage>
    ) : (
        <SendtMessage>
            <legend>{name}</legend>
            {message}
        </SendtMessage>
    );

    return <>{MessageStyle}</>;
};

export default StyledMessage;
