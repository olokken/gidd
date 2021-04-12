import React, { ChangeEvent, KeyboardEventHandler } from 'react';
import { TextField, Button } from '@material-ui/core';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 100px;
`;

const Map = () => {
    return (
        <Container>
            <h1>Dette er kartet</h1>
        </Container>
    );
};

export default Map;
