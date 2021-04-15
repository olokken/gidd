import React from 'react'; 
import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import {UserContext} from './components/UserContext'
import { useState } from 'react';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#f44336',
      contrastText: '#fff',
    },
    secondary: {
      main: '#000',
      contrastText: '#000',
    }
  }
})

function App() {
  const [user, setUser] = useState<any>(null)

  return (
    <ThemeProvider theme = {theme}>
    <BrowserRouter>
    <UserContext.Provider value={{user,setUser}}>
      <div className="App">{Routes}</div>
    </UserContext.Provider>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
