import {
    Button,
    Drawer,
    makeStyles,
    TextField,
    Theme,
    createStyles,
    useTheme,
} from '@material-ui/core';
import React, {
    ChangeEvent,
    useEffect,
    useState,
    useRef,
    useContext,
} from 'react';
import styled from 'styled-components';
import StyledMessage from './StyledMessage';
import io from 'socket.io-client';
import { SocketContext } from '../../SocketContext';
import axios from '../../Axios';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const MessageBox = styled.div`
    height: 80%;
    overflow-y: auto;
`;

const SendMessage = styled.div`
    display: flex;
    position: absolute;
    bottom: 0;
    width: 95%;
`;

const Flex = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 1rem;
`;

interface Props {
    open: boolean;
    close: () => void;
}

const Chat = ({ open, close }: Props) => {
    const socket = useContext(SocketContext);
    const [message, setMessage] = useState<string>();
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        //Først hente ut chattehistorikk..
        /*axios.get('/')*/
        socket.current.on('message', (msg: any) => {
            console.log(msg);
        });
    }, []);

    const sendMessage = () => {
        socket.current.emit('send', message);
    };

    const onChangeMessage = (event: ChangeEvent<HTMLInputElement>) => {
        const msg: string = (event.target as HTMLInputElement).value;
        setMessage(msg);
    };

    return (
        <Drawer variant="persistent" anchor="right" open={open}>
            <Container>
                <Flex>
                    <h2>CHAT</h2>
                    <Button onClick={close}>Lukk</Button>
                </Flex>
                <MessageBox>
                    <StyledMessage
                        isRecieved={false}
                        sender={'Ole'}
                        message={'Satans horebukk'}
                    ></StyledMessage>
                    <StyledMessage
                        isRecieved={true}
                        sender={'Taper'}
                        message={'Kjør da Åre'}
                    ></StyledMessage>
                </MessageBox>
                <SendMessage>
                    <TextField
                        onChange={onChangeMessage}
                        style={{
                            width: '90%',
                            marginLeft: '1rem',
                            height: '5rem',
                        }}
                        label="Send Melding"
                    ></TextField>
                    <Button style={{ width: '10%' }} onClick={sendMessage}>
                        Send
                    </Button>
                </SendMessage>
            </Container>
        </Drawer>
    );
};

export default Chat;
