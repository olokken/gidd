import React, { useEffect, useRef } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { UserContext } from './UserContext';
import { SocketContext } from './SocketContext';
import { useState, useMemo } from 'react';
import User from './interfaces/User';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#f44336',
            contrastText: '#fff',
        },
        secondary: {
            main: '#000',
            contrastText: '#000',
        },
    },
});

function App() {
    const [user, setUser] = useState<string>();
    const value = useMemo(() => ({ user, setUser }), [user, setUser]);
    const socket = useRef<any>();

    useEffect(() => {
        const id = localStorage.getItem('userID');
        if (id !== null) {
            setUser(id);
        }

        const socket = new SockJS('http://13.51.58.86:8080/ws');

        const stompClient = Stomp.over(socket);

        socket.onopen = () => {
            console.log('oookei');
        };

        stompClient.connect({}, (frame) => {
            console.log(frame);
            stompClient.subscribe('/client/chat/1', () => console.log('test'));
        });
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <SocketContext.Provider value={socket}>
                    <UserContext.Provider value={value}>
                        <div className="App">{Routes}</div>
                    </UserContext.Provider>
                </SocketContext.Provider>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
