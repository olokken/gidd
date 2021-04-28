import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Slider, TextField, Button } from '@material-ui/core';

const Container = styled.div`
    width: 100%;
    margin-top: '20px';
`;

interface Props {
    onTimeFromChange: (searchResult: Date) => void;
    onTimeToChange: (searchResult: Date) => void;
}

const TimeFilter = ({ onTimeFromChange, onTimeToChange }: Props) => {
    const [from, setFrom] = useState<Date>(new Date(0));
    const [to, setTo] = useState<Date>(new Date(2050, 0, 0));

    useEffect(() => {
        onTimeFromChange(from);
    }, [from]);

    useEffect(() => {
        onTimeToChange(to);
    }, [to]);

    const handleFromChange = (event: any) => {
        setFrom(event.target.value as Date);
    };

    const handleToChange = (event: any) => {
        setTo(event.target.value as Date);
    };

    const reset = () => {
        setFrom(new Date(0));
        setTo(new Date(2050, 0, 0));
    };

    return (
        <Container>
            <h3>Tidspunkt</h3>
            <TextField
                onChange={handleFromChange}
                style={{
                    marginBottom: '10px',
                    marginRight: '5px',
                    minWidth: '140px',
                }}
                label="FRA TIDSPUNKT"
                type="datetime-local"
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                onChange={handleToChange}
                style={{
                    marginBottom: '10px',
                    marginRight: '5px',
                    minWidth: '140px',
                }}
                label="TIL TIDSPUNKT"
                type="datetime-local"
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <Button onClick={reset}>Nullstill</Button>
        </Container>
    );
};

export default TimeFilter;
