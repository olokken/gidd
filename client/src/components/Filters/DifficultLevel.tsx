import { FormControl, FormControlLabel, Checkbox } from '@material-ui/core';
import React, {useState} from 'react';
import styled from 'styled-components';

const Container = styled.div`
    justify-content: center;
`;
const DifficultLevel = () => {
    const [state, setState] = useState({
        Lav: false,
        Middels: false,
        Høy: false,
      });

      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [event.target.name]: event.target.checked });
      };

    return (
        <Container>
            <h3>Vanskelighetsgrad</h3>
            <FormControl>
                <FormControlLabel
                    control={<Checkbox name="Lav" onChange={handleChange} />}
                    label='Lav'
                />
                <FormControlLabel
                    control={<Checkbox name="Middels" onChange={handleChange} />}
                    label='Middels'
                />

                <FormControlLabel
                    control={<Checkbox name="Høy" onChange={handleChange} /> }
                    label='Høy'
                    name="Høy"
                />
            </FormControl>
        </Container>
    );
};

export default DifficultLevel;
