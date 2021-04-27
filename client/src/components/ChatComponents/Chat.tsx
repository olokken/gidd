import { Button, Drawer, TextField } from '@material-ui/core';
import React, {
    ChangeEvent,
    useEffect,
    useState,
    useRef,
    useContext,
} from 'react';
import styled from 'styled-components';
import StyledMessage from './StyledMessage';
import axios from '../../Axios';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { UserContext } from '../../UserContext';
import MessageResponse from '../../interfaces/MessageResponse';

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
    activityId: number;
}

const Chat = ({ open, close, activityId }: Props) => {
    const [message, setMessage] = useState<string>();
    const { user } = useContext(UserContext);
    const [chat, setChat] = useState<MessageResponse[]>([]);
    const socket = useRef<any>();

    useEffect(() => {
        if (open) {
            axios.get(`/chat/${activityId}`).then((response) => {
                console.log(response);
            });
            const so = new SockJS('http://13.51.58.86:8080/ws');
            socket.current = Stomp.over(so);
            socket.current.connect();
        }
        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, [open]);

    useEffect(() => {
        if (socket.current) {
            socket.current.subscribe(
                `/client/chat/${activityId}`,
                (event: any) => {
                    console.log(JSON.parse(event.body));
                    setChat([...chat, JSON.parse(event.body)]);
                }
            );
        }
    }, [socket.current, chat]);
    const sendMessage = () => {
        console.log(activityId);
        socket.current.send(
            `/server/chat/${activityId}`,
            {},
            JSON.stringify({
                userId: user,
                message: message,
            })
        );
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
                    {chat.map((msg, index) => (
                        <StyledMessage
                            key={index}
                            name={msg.user.firstName}
                            time={msg.timestamp}
                            userId={msg.user['userID']}
                            message={msg.message}
                        ></StyledMessage>
                    ))}
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
            <Button onClick={() => console.log(chat)}>hahahahah</Button>
        </Drawer>
    );
};

export default Chat;
