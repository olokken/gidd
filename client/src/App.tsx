import React from 'react'; 
import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

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
  return (
    <ThemeProvider theme = {theme}>
    <BrowserRouter>
      <div className="App">{Routes}</div>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
