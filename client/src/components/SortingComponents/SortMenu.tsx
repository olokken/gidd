import React, { useState } from 'react';
import styled from 'styled-components';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

const SortMenu = () => {
    const [sortValue, setSortValue] = useState<number>(5);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSortValue(event.target.value as number);
    };

    return (
        <FormControl
            style={{ marginRight: '10px', width: '100%', maxWidth: '500px' }}
        >
            <InputLabel>Sortering</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                onChange={handleChange}
            >
                <MenuItem value={1}>Kommende</MenuItem>
                <MenuItem value={3}>Kort avstand - Lang avstand</MenuItem>
                <MenuItem value={5}>Liten kapasitet - Stor kapasitet</MenuItem>
                <MenuItem value={8}>
                    Lav Vanskelighetsgrad - Høy vanskelighetsgrad
                </MenuItem>
            </Select>
        </FormControl>
    );
};

export default SortMenu;
