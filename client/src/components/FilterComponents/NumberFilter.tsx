import React, { ChangeEvent, useState } from 'react';
import { Slider, TextField } from '@material-ui/core';
import styled from 'styled-components';

const SliderContainer = styled.div`
  width: 100%;
  margin-top:'20px'; 
`;

interface Props {
  headline: string;
  minValue: number;
  maxValue: number;
}

const NumberFilter = ({ minValue, maxValue, headline }: Props) => {
  const [value, setValue] = useState<number[]>([0, 20]);

  const handleChange = (event: any, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  const onChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = [parseInt(event.target.value), value[1]];
    setValue(newValue);
  };

  const onChangeValue2 = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = [value[0], parseInt(event.target.value)];
    setValue(newValue);
  };

  return (
    <SliderContainer>
      <h3>{headline}</h3>
      <TextField
        style={{minWidth:"60px",width: '45%', marginBottom: 24, marginRight: '5px' }}
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
        style={{minWidth:"60px", width: '45%', marginBottom: 24, marginRight: '5px' }}
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
    </SliderContainer>
  );
};

export default NumberFilter;