import React, { ChangeEvent, KeyboardEventHandler } from 'react';
import styled from 'styled-components';
import { UserContext } from '../components/UserContext';
import { useContext } from 'react';

const Container = styled.div`
    display: flex;
    justify-content: center;
    margin-top:100px; 
`;

const HomePage = () => {
    const {user} = useContext(UserContext)
    return (
        <Container>
            <p>{{user}}</p>
        </Container>
    );
};

export default HomePage;
