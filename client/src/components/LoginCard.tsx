import React, { ChangeEvent, KeyboardEventHandler } from 'react';
import { TextField, Button, InputAdornment } from '@material-ui/core';
import styled from 'styled-components';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f44336',
      contrastText: '#000',
    },
  },
});




const LoginCardContainer = styled.div`
  width: 30rem;
  height: 28rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 3rem;
  border-radius: 8px;
`;

interface Props {
  onLogin: () => void;
  onNewUser: () => void;
  onChangeUsername: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangePassword: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: any) => void;
  handleClickShowPassword: () => void;
  showPassword: boolean;
}




const LoginCard = ({
  onLogin,
  onNewUser,
  onChangeUsername,
  onChangePassword,
  onKeyDown,
  handleClickShowPassword,
  showPassword
}: Props) => {
  return (
    <LoginCardContainer>
      <h2>LOG IN</h2>
      <TextField
        style={{ width: '100%', marginBottom: 24 }}
        label="Username"
        color="secondary"
        onChange={onChangeUsername}
        variant="outlined"
        onKeyDown={onKeyDown}
      />
      <TextField
        label="Password"
        variant="outlined"
        color = "secondary"
        style={{ width: '100%', marginBottom: 24 }}
        type={!showPassword ? "password" : "text"}
        onChange={onChangePassword}
        onKeyDown={onKeyDown}
        InputProps={{
          endAdornment: <InputAdornment position="end">
            <IconButton onClick={handleClickShowPassword} >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }}
      />
      <Button
        style={{ width: '100%', height: '50px' }}
        variant="contained"
        color="primary"
        onClick={onLogin}
      >
        LOG IN
      </Button>
      <Button
        style={{ width: '100%', marginTop: '15px', height: '50px' }}
        variant="contained"
        color="primary"
        onClick={onNewUser}
      >
        CREATE NEW USER
      </Button>
    </LoginCardContainer>
  );
};

export default LoginCard;
