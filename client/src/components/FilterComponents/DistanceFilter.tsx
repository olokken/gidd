import React, { ChangeEvent, useState, useEffect } from 'react';
import { Slider, TextField } from '@material-ui/core';
import styled from 'styled-components';

const Inputs = styled.div`
    display: flex;
    width: 100%;
`;

const Container = styled.div``;
interface Props {
    onDistanceChange: (dist: number) => void;
}
const DistanceFilter = ({ onDistanceChange }: Props) => {
    const [maxDistance, setMaxDistance] = useState<number>(
        Number.MAX_SAFE_INTEGER
    );

    const changeValue = (event: ChangeEvent<HTMLInputElement>) => {
        setMaxDistance(parseInt(event.target.value));
    };

    useEffect(() => {
        onDistanceChange(maxDistance);
    }, [maxDistance]);

    const handleChange = (event: any, newValue: number | number[]) => {
        setMaxDistance(newValue as number);
    };

    return (
        <Container>
            <h3>Avstand i km</h3>
            <Inputs>
                <Slider
                    style={{ minWidth: '100px', marginRight: '10px' }}
                    value={maxDistance}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={1}
                    min={0}
                    max={200}
                    onChange={handleChange}
                />
                <TextField
                    style={{ minWidth: '45px', width: '4rem' }}
                    value={maxDistance}
                    type="number"
                    onChange={changeValue}
                />
            </Inputs>
        </Container>
    );
};

export default DistanceFilter;
