import React, { ChangeEvent, KeyboardEventHandler, useContext } from 'react';
import { TextField, Button } from '@material-ui/core';
import styled from 'styled-components';
import { UserContext } from '../components/UserContext';

const Container = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 100px;
`;

const Map = () => {
    const {user} = useContext(UserContext);
    return (
        <Container>
            <h1></h1>
        </Container>
    );
};

export default Map;
