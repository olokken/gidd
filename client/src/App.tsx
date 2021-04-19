import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { UserContext } from './UserContext';
import { useState, useMemo } from 'react';
import User from './interfaces/User';

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

    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <UserContext.Provider value={value}>
                    <div className="App">{Routes}</div>
                </UserContext.Provider>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
