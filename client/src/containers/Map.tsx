import React from 'react';
import styled from 'styled-components';
import MapComponent from '../components/MapComponents/MapComponent';

const Container = styled.div`
    display: flex;
    justify-content: center;
`;

const Map = () => {
    return (
        <Container>
            <MapComponent></MapComponent>
        </Container>
    );
};

export default Map;
