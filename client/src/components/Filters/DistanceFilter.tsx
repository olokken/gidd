import React, { ChangeEvent, useState } from 'react';
import { Slider, TextField } from '@material-ui/core';
import styled from 'styled-components';

const Inputs = styled.div`
    display: flex;
    width: 100%;
`;

const Container = styled.div``;
const DistanceFilter = () => {
    const [value, setValue] = useState<number>(300);

    const changeValue = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(parseInt(event.target.value)); 
    }

    const handleChange = (event: any, newValue: number | number[]) => {
        setValue(newValue as number);
      };

    return (
        <Container>
            <h3>Avstand i km</h3>
            <Inputs>
                <Slider
                    style={{ marginRight: '10px' }}
                    defaultValue={100}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={1}
                    min={0}
                    max={100}
                    onChange={handleChange}
                />
                <TextField
                    style={{ width: '4rem' }}
                    value={value}
                    type="number"
                    onChange={changeValue}
                />
            </Inputs>
        </Container>
    );
};

export default DistanceFilter;
