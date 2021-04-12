import React, { ChangeEvent, KeyboardEventHandler } from 'react';
import { TextField, Button } from '@material-ui/core';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    justify-content: center;
    margin-top:100px; 
`;

const HomePage = () => {
    return (
        <Container>
            <h1>Dette er hjemmesiden</h1>
        </Container>
    );
};

export default HomePage;
