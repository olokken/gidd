import React, { ChangeEvent, useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import styled from 'styled-components';

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
  createUser: (username: string, password: string) => boolean;
}

const NewUserCard = ({ createUser }: Props) => {
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const onChangeUsername = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername((event.target as HTMLInputElement).value);
  };

  const onChangePassword1 = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword1((event.target as HTMLInputElement).value);
  };
  const onChangePassword2 = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword2((event.target as HTMLInputElement).value);
  };

  const onClick = () => {
    if (passwordCheck) {
      if (createUser(username, password1) === false) {
        alert('Fyfaen Aleeks');
      }
    } else {
      alert('Fyfaen Aleeks, passordene matcher ikke');
    }
  };

  const passwordCheck: boolean = password1 === password2 ? true : false;

  return (
    <LoginCardContainer>
      <h2>LOG IN</h2>
      <form>
        <TextField
          style={{ width: '100%', marginBottom: 24 }}
          label="Username"
          variant="outlined"
          onChange={onChangeUsername}
        />
        <TextField
          style={{ width: '100%', marginBottom: 24 }}
          label="Password"
          variant="outlined"
          type="password"
          onChange={onChangePassword1}
        />
        <TextField
          style={{ width: '100%', marginBottom: 5 }}
          label="Password"
          variant="outlined"
          type="password"
          onChange={onChangePassword2}
        />
        {passwordCheck == false && <a>Passwords do not match</a>}
        <Button
          style={{ width: '100%', height: '50px' }}
          variant="contained"
          color="secondary"
          onClick={onClick}
        >
          CREATE NEW USER
        </Button>
      </form>
    </LoginCardContainer>
  );
};

export default NewUserCard;
