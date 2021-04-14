import React, { useState, ChangeEvent, KeyboardEventHandler } from 'react';
import { TextField, Button } from '@material-ui/core';
import styled from 'styled-components';
import ActivityPopup from '../components/ActivityPopup';
import ActivityForm from '../components/ActivityForm';

const Container = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 100px;
`;

const HomePage = () => {
    const [openPopup, setOpenPopup] = useState<boolean>(false);
    return (
        <Container>
            <h1>Dette er hjemmesiden</h1>
            <button onClick={() => setOpenPopup(!openPopup)}>Popup</button>
            <ActivityPopup
                title="Legg til aktivitet"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
                <ActivityForm
                    openPopup={openPopup}
                    setOpenPopup={setOpenPopup}
                />
            </ActivityPopup>
        </Container>
    );
};

export default HomePage;
