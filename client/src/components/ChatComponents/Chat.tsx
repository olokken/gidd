import { Button, Drawer, TextField } from '@material-ui/core';
import React, {
    ChangeEvent,
    useEffect,
    useState,
    useRef,
    useContext,
} from 'react';
import styled from 'styled-components';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import StyledMessage from './StyledMessage';
import axios from '../../Axios';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { UserContext } from '../../UserContext';
import MessageResponse from '../../interfaces/MessageResponse';

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const MessageBox = styled.div`
    max-height: 37rem;
    overflow: hidden;
    overflow-y: scroll;
`;

const SendMessage = styled.div`
    display: flex;
    position: absolute;
    bottom: 0;
    margin-top: 5rem;
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
                console.log(response.data['messages']);
                setChat(response.data['messages']);
            });
            socketConn();
        }
    }, [open]);

    const socketConn = async () => {
        const so = await new SockJS('http://13.51.58.86:8080/ws');
        socket.current = await Stomp.over(so);
        socket.current.connect();
    };

    useEffect(() => {
        if (socket.current) {
            if (socket.current.connected) {
                socket.current.subscribe(
                    `/client/chat/${activityId}`,
                    (event: any) => {
                        console.log(JSON.parse(event.body));
                        setChat([...chat, JSON.parse(event.body)]);
                    }
                );
            }
        }
    }, [socket, chat]);

    const sendMessage = () => {
        if (socket.current && message !== '') {
            socket.current.send(
                `/server/chat/${activityId}`,
                {},
                JSON.stringify({
                    userId: user,
                    message: message,
                })
            );
            setMessage('');
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat]);

    const onKeyDown = (e: any) => {
        if (e.code === 'Enter') {
            sendMessage();
        }
    };

    const scrollToBottom = () => {
        const messagebox = document.getElementById('chat');
        if (messagebox) {
            messagebox.scrollTop = messagebox.scrollHeight;
        }
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
                    <Button
                        onClick={() => {
                            close();
                            if (socket.current) {
                                socket.current.disconnect();
                            }
                        }}
                    >
                        Lukk
                    </Button>
                </Flex>
                <MessageBox id="chat">
                    {chat.map((msg, index) => (
                        <StyledMessage
                            key={index}
                            name={msg.user.firstName}
                            time={msg.timestamp}
                            userId={msg.user.userId}
                            message={msg.message}
                        ></StyledMessage>
                    ))}
                </MessageBox>
                <SendMessage>
                    <TextField
                        onKeyDown={onKeyDown}
                        onChange={onChangeMessage}
                        value={message}
                        style={{
                            width: '90%',
                            marginLeft: '1rem',
                            height: '5rem',
                        }}
                        label="Send Melding"
                    ></TextField>
                    <Button
                        color="primary"
                        variant="contained"
                        style={{
                            width: '10%',
                            height: '10%',
                            marginLeft: '0.5rem',
                        }}
                        onClick={sendMessage}
                    >
                        <SendRoundedIcon />
                    </Button>
                </SendMessage>
            </Container>
        </Drawer>
    );
};

export default Chat;
