import React from 'react';
import styled from 'styled-components';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

const Container = styled.div`
    justify-content: right;
    margin-top: 5px; 
`;

const SortMenu = (props: any) => {
    return (
        <Container>
            <FormControl>
                <InputLabel>Sortering</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    //value={age}
                    //onChange={handleChange}
                >
                    <MenuItem value={10}>Kort avstand - Lang avstand</MenuItem>
                    <MenuItem value={20}>Lang avstand - Kort avstand</MenuItem>
                    <MenuItem value={30}>Liten kapasitet - Stor kapasitet</MenuItem>
                    <MenuItem value={40}>Stor kapasitet - Liten kapasitet</MenuItem>
                    <MenuItem value={50}>Høy Vanskelighetsgrad - Lav vanskelighetsgrad</MenuItem>
                    <MenuItem value={60}>Lav Vanskelighetsgrad - Høy vanskelighetsgrad</MenuItem>
                </Select>
            </FormControl>
        </Container>
    );
};

export default SortMenu;
