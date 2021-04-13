import React, { ChangeEvent, useState } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import NewUserCard from '../components/NewUserCard';

const NewUsernContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #334d50; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #cbcaa5,
    #334d50
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #cbcaa5,
    #334d50
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
`;

const NewUser = () => {
  const history = useHistory();
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password1, setPassword1] = useState<string>('');
  const [password2, setPassword2] = useState<string>('');
  const equalPasswords: boolean = password1 === password2 ? true : false;
  const [emailList, setEmailList] = useState(['haavard.tysland@lyse.net']);
  const correctEmailFormat = email.indexOf('@') > -1 ? true : false;


  const emailCheck = (email: string) => {
    if (emailList.indexOf(email) > -1) {
      return false;
    }
    return true;
  }

  const createUser = (username: string, email: string, password: string): boolean => {
    if (!emailCheck(email)) {
      return false;
    }
    else if (!equalPasswords && password1 !== '') {
      alert('Passordene er ulike');
      return false;
    } else {
        history.push('/');
        console.log('New User Registered!\nUsername: ' + username + '\nE-mail: ' + email + '\nPassword: ' + password)
        return true; 
      }
    }

    const onChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
      const currentEmail: string = (event.target as HTMLInputElement).value
      setEmail(currentEmail);
    };

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
      if (equalPasswords) {
        createUser(username, email, password1);
      } else {
        alert('Noe gikk galt');
      }
    };

    return (
      <NewUsernContainer>
        <NewUserCard
          onChangeUsername={onChangeUsername}
          onChangeEmail={onChangeEmail}
          onChangePassword1={onChangePassword1}
          onChangePassword2={onChangePassword2}
          onClick={onClick}
          equalPasswords={equalPasswords}
          correctEmailFormat={correctEmailFormat}
        ></NewUserCard>
      </NewUsernContainer>
    );
  };

  export default NewUser;
