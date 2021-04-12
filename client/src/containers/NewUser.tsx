import React from 'react';
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

  const createUser = (username:string, password:string):boolean => {
    console.log(username + password); 
    history.push("/");  
    return true;  
  }

  return (
    <NewUsernContainer>
      <NewUserCard createUser = {createUser}></NewUserCard>
    </NewUsernContainer>
  );
};

export default NewUser;
