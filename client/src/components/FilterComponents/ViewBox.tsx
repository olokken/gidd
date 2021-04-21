import { FormControl, FormControlLabel, Checkbox } from '@material-ui/core';
import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    justify-content: center;
    margin-top: 1rem;
`;

interface Props {
    label: string;
}

const ViewBox = ({ label }: Props) => {
    const [state, setState] = useState({
        label: false,
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    return (
        <Container>
            <FormControl>
                <FormControlLabel
                    control={<Checkbox name={label} onChange={handleChange} />}
                    label={label}
                />
            </FormControl>
        </Container>
    );
};

export default ViewBox;
