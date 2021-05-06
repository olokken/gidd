import { Avatar, Tooltip } from '@material-ui/core';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from '../../UserContext';

interface Props {
    message: string;
    name: string;
    userId: string;
    time: number;
    image: string;
}


const SendtMessage = styled.fieldset`
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

const Flex = styled.div`
    display:flex;
`;

const RecievedMessage = styled.fieldset`
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

const StyledMessage = ({ message, userId, time, name, image }: Props) => {
    const { user } = useContext(UserContext);
    const date = new Date(time);

    const MessageStyle = (): React.ReactElement => {
        if (userId == user) {
            return (
                <RecievedMessage>
                    <legend>{name}</legend>
                    <Flex>
                        <Avatar src={image} />{message}
                    </Flex>
                </RecievedMessage>
            );
        } else {
            return (
                <SendtMessage>
                    <legend>{name}</legend>
                    <Flex>
                        <Avatar src={image} />{message}
                    </Flex>
                </SendtMessage>
            );
        }
    };

    return <Tooltip title={date.toString()}>{MessageStyle()}</Tooltip>;
};

export default StyledMessage;
