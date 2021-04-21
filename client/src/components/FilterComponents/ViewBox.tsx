import { FormControl, FormControlLabel, Checkbox } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    justify-content: center;
    margin-top: 1rem;
`;

interface Props {
    label: string;
    onStateChange: (state: boolean) => void;
}

const ViewBox = ({ label, onStateChange }: Props) => {
    const [state, setState] = useState<boolean>(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState(event.target.checked)
    };

    useEffect(() => {
        onStateChange(state)
    }, [state]);

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
