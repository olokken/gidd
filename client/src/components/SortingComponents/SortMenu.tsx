import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
} from '@material-ui/core';

interface Props {
    onSortChange: (sortValue: number) => void;
    children?: React.ReactNode;
}

const SortMenu = ({ onSortChange, children }: Props) => {
    const [sortValue, setSortValue] = useState<number>(-1);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSortValue(event.target.value as number);
    };

    useEffect(() => {
        onSortChange(sortValue);
    }, [sortValue]);

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
                <MenuItem value={1}>Eldst - Nyest</MenuItem>
                <MenuItem value={2}>Kort avstand - Lang avstand</MenuItem>
                <MenuItem value={3}>Liten kapasitet - Stor kapasitet</MenuItem>
                <MenuItem value={4}>
                    Lav Vanskelighetsgrad - Høy vanskelighetsgrad
                </MenuItem>
            </Select>
            {children}
        </FormControl>
    );
};

export default SortMenu;
