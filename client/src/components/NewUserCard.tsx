import React, { ChangeEvent} from 'react';
import { TextField, Button, colors } from '@material-ui/core';
import styled from 'styled-components';
import InputAdornment from '@material-ui/core/InputAdornment';

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
  onChangeUsername: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeEmail:(e: ChangeEvent<HTMLInputElement>) => void;
  onChangePassword1: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangePassword2: (e: ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  equalPasswords:boolean;
  correctEmailFormat:boolean;
}

const NewUserCard = ({onChangeUsername, onChangeEmail, onChangePassword1, onChangePassword2, onClick, equalPasswords, correctEmailFormat }: Props) => {

  return (
    <LoginCardContainer>
      <h2>Register a new user</h2>
      <form>
        <TextField
          style={{ width: '100%', marginBottom: 24 }}
          label="Username"
          color="secondary"
          variant="outlined"
          onChange={onChangeUsername}
        />
        
        <TextField
          style={{ width: '100%', marginBottom: 24 }}
          label="E-mail"
          color="secondary"
          variant="outlined"
          onChange={onChangeEmail}
          InputProps={{
            endAdornment:
             <InputAdornment position="end" style= {{
                fontSize:'10px',
                color:'red'
             }}>
              {correctEmailFormat === false && <a>Email must include a @</a>}
              </InputAdornment>
          }}
        />
        <TextField
          style={{ width: '100%', marginBottom: 24 }}
          label="Password"
          color="secondary"
          variant="outlined"
          type="password"
          onChange={onChangePassword1}
        />
        <TextField
          style={{ width: '100%', marginBottom: 5 }}
          label="Password"
          color="secondary"
          variant="outlined"
          type="password"
          onChange={onChangePassword2}
        />
        {equalPasswords === false && <a>Passwords do not match</a>}
        <Button
          style={{ width: '100%', height: '50px' }}
          variant="contained"
          color="primary"
          onClick={onClick}
        >
          CREATE NEW USER
        </Button>
      </form>
    </LoginCardContainer>
  );
};

export default NewUserCard;
