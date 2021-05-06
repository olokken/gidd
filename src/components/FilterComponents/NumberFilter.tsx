import React, { ChangeEvent, useEffect, useState } from 'react';
import { Slider, TextField, Button } from '@material-ui/core';
import styled from 'styled-components';

const SliderContainer = styled.div`
    width: 100%;
    margin-top: '20px';
`;

interface Props {
    headline: string;
    minValue: number;
    maxValue: number;
    onCapacityChange: (range: number[]) => void;
}

const NumberFilter = ({
    minValue,
    maxValue,
    headline,
    onCapacityChange,
}: Props) => {
    const [value, setValue] = useState<number[]>([0, 10000]);

    useEffect(() => {
        onCapacityChange(value);
    }, [value]);

    useEffect(() => {
        onCapacityChange(value);
    }, [value]);
    const handleChange = (event: any, newValue: number | number[]) => {
        setValue(newValue as number[]);
    };

    const onChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = [parseInt(event.target.value), value[1]];
        if (newValue[0] >= 0 && newValue[0] <= newValue[1]) {
            setValue(newValue);
        }
    };

    const onChangeValue2 = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = [value[0], parseInt(event.target.value)];
        if (newValue[1] >= newValue[0]) {
            setValue(newValue);
        }
    };

    const reset = () => {
        setValue([0, 10000]); 
    }

    return (
        <SliderContainer>
            <h3>{headline}</h3>
            <TextField
                style={{
                    minWidth: '60px',
                    width: '45%',
                    marginBottom: 24,
                    marginRight: '5px',
                }}
                onChange={onChangeValue}
                value={value[0]}
                id="filled-number"
                label="Min"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="outlined"
            />
            <TextField
                style={{
                    minWidth: '60px',
                    width: '45%',
                    marginBottom: 24,
                    marginRight: '5px',
                }}
                onChange={onChangeValue2}
                value={value[1]}
                id="filled-number"
                label="Max"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="outlined"
            />
            <Slider
                value={value}
                onChange={handleChange}
                valueLabelDisplay="off"
                aria-labelledby="range-slider"
                min={minValue}
                max={maxValue}
            />
            <Button onClick={reset}>Nullstill</Button>
        </SliderContainer>
    );
};

export default NumberFilter;
