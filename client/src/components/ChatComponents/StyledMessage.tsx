import React from 'react';
import styled from 'styled-components';

interface Props {
    message: string;
    sender: string;
    isRecieved: boolean;
}

const SendtMessage = styled.p`
    margin-right: 30%;
    border: 4px solid black;
    border-radius: 10rem;
    max-width: 100%;
`;

const RecievedMessage = styled.p`
    border: 4px solid red;
    border-radius: 10rem;
    max-width: 100%;
    margin-left: 30%;
`;

const Sender = styled.p`
    margin-left: 30%;
`;

const Reciever = styled.p`
    margin-right: 30%;
`;

const StyledMessage = ({ message, sender, isRecieved }: Props) => {
    const MessageStyle = isRecieved ? (
        <RecievedMessage>{message}</RecievedMessage>
    ) : (
        <SendtMessage>{message}</SendtMessage>
    );

    const SenderStyle = isRecieved ? (
        <Sender>{sender}</Sender>
    ) : (
        <Reciever>{sender}</Reciever>
    );

    return (
        <>
            {SenderStyle}
            {MessageStyle}
        </>
    );
};

export default StyledMessage;
