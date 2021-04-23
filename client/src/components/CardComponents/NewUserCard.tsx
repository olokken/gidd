import React, { ChangeEvent } from 'react';
import { TextField, Button, MenuItem } from '@material-ui/core';
import styled from 'styled-components';
import InputAdornment from '@material-ui/core/InputAdornment';

const RegisterContainer = styled.div`
  width: 30rem;
  height: 40rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 3rem;
  border-radius: 8px;
`;


interface Props {
  onChangeFirstName: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeSurname: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeActivityLevel: (e: ChangeEvent<HTMLInputElement>) => void;
  activityLevel: string;
  visualActivityLevel: string;
  onChangeEmail: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeNumber: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangePassword1: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangePassword2: (e: ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  equalPasswords: boolean;
  correctEmailFormat: boolean;
  email: string;
}


const NewUserCard = ({ onChangeFirstName, onChangeSurname, onChangeActivityLevel, activityLevel, visualActivityLevel, onChangeEmail, onChangeNumber, onChangePassword1, onChangePassword2, onClick, equalPasswords, correctEmailFormat, email }: Props) => {
  const activityLevels: string[] = ['Lav', 'Middels', 'Høyt']

  return (
    <RegisterContainer>
      <h2>Registrer en ny bruker</h2>
      <form>
        <TextField
          style={{ width: '100%', marginBottom: 24 }}
          label="Fornavn"
          color="secondary"
          variant="outlined"
          onChange={onChangeFirstName}
        />
        <TextField
          style={{ width: '100%', marginBottom: 24 }}
          label="Etternavn"
          color="secondary"
          variant="outlined"
          onChange={onChangeSurname}
        />
        <TextField
          style={{ width: '100%', marginBottom: 24 }}
          label="E-mail"
          color="secondary"
          variant="outlined"
          onChange={onChangeEmail}
          InputProps={{
            endAdornment:
              <InputAdornment position="end" style={{
                fontSize: '10px',
                color: '#f44336'
              }}>
                {email !== '' && correctEmailFormat === false && <a>E-mail må inneholde en @</a>}
              </InputAdornment>
          }}
        />
        <TextField
          style={{ width: '100%', marginBottom: 24 }}
          select
          color='secondary'
          label="Velg ditt aktivitetsnivå"
          value={visualActivityLevel}
          onChange={onChangeActivityLevel}
          variant="outlined"
        >
          {activityLevels.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          style={{ width: '100%', marginBottom: 24 }}
          label="Telefonnummer"
          color="secondary"
          variant="outlined"
          onChange={onChangeNumber}
        />
        <TextField
          style={{ width: '100%', marginBottom: 24 }}
          label="Passord"
          color="secondary"
          variant="outlined"
          type="paswsord"
          onChange={onChangePassword1}
        />
        <TextField
          style={{ width: '100%', marginBottom: 5 }}
          label="Passord"
          color="secondary"
          variant="outlined"
          type="password"
          onChange={onChangePassword2}
        />
        {equalPasswords === false && <a>Passordene er ulike!</a>}
        <Button
          style={{ width: '100%', height: '50px' }}
          variant="contained"
          color="primary"
          onClick={onClick}
        >
          OPPRETT BRUKER
        </Button>
      </form>
    </RegisterContainer>
  );
};

export default NewUserCard;
