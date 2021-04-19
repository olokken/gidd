import { FormControl, FormControlLabel, Checkbox } from '@material-ui/core';
import React, {useState} from 'react';
import styled from 'styled-components';

const Container = styled.div`
    justify-content: center;
`;

const ActivityBoxes = () => {
    const [state, setState] = useState({
        Fotball: false,
        Basket: false,
        Frisbeegolf: false,
        Langrenn: false,
        Fjelltur: false,
        Kajakk: false, 
        Bading: false
      });



      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [event.target.name]: event.target.checked });
        console.log(state); 
      };

    return (
        <Container>
            <h3>Aktiviteter</h3>
            <FormControl>
                <FormControlLabel
                    control={<Checkbox name="Fotball" onChange={handleChange} />}
                    label={'Fotball'}
                />
                <FormControlLabel
                    control={<Checkbox name="Basket" onChange={handleChange} />}
                    label={'Basket'}
                />
                <FormControlLabel
                    control={<Checkbox name="Frisbeegolf" onChange={handleChange} />}
                    label={'Frisbeegolf'}
                />
                <FormControlLabel
                    control={<Checkbox name="Langrenn" onChange={handleChange} />}
                    label={'Langrenn'}
                />
                <FormControlLabel
                    control={<Checkbox name="Fjelltur" onChange={handleChange} />}
                    label={'Fjelltur'}
                />
                <FormControlLabel
                    control={<Checkbox name="Kajakk" onChange={handleChange} />}
                    label={'Kajakk'}
                />
                <FormControlLabel
                    control={<Checkbox name="Bading" onChange={handleChange} />}
                    label={'Bading'}
                />
            </FormControl>
        </Container>
    );
};

export default ActivityBoxes;
