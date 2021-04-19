import React, { useState } from 'react';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';
const Container = styled.div``;

const TimeFilter = () => {
    const [from, setFrom] = useState<Date>();
    const [to, setTo] = useState<Date>();

    const handleFromChange = (event: any) => {
        setFrom(event.target.value as Date);
    };

    const handleToChange = (event: any) => {
        setTo(event.target.value as Date);
    };

    return (
        <Container>
            <h3>Tidspunkt</h3>
            <TextField
                onChange={handleFromChange}
                style={{ marginBottom: '10px', marginRight:'5px' }}
                label="FRA TIDSPUNKT"
                type="datetime-local"
                defaultValue="2017-05-24T10:30"
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                onChange={handleToChange}
                label="TIL TIDSPUNKT"
                type="datetime-local"
                defaultValue="2017-05-24T10:30"
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </Container>
    );
};

export default TimeFilter;
