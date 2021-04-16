import React from 'react';
import styled from 'styled-components';
import NumberFilter from './NumberFilter';
import DifficultLevel from './DifficultLevel';
import ActivityBoxes from './ActivityBoxes';
import TimeFilter from './TimeFilter';
import DistanceFilter from './DistanceFilter';
import { TextField, Drawer } from '@material-ui/core';

const StyledContainer = styled.div`
    margin-left: 1rem;
    margin-top:1rem;
    width: 20%;
`;

const SideFilterMobile = () => {

     const handleDrawerOpen = () =>
        setState((prevState) => ({ ...prevState, drawerOpen: true }));

    const handleDrawerClose = () =>
        setState((prevState) => ({ ...prevState, drawerOpen: false }));
    return (
        <Drawer
                    {...{
                    anchor: "right",
                    open: drawerOpen,
                    onClose: handleDrawerClose,
                    }}
                >
            <StyledContainer>
                <TextField style={{width:'95%'}} label="Search" variant="outlined" />
                <DistanceFilter></DistanceFilter>
                <TimeFilter></TimeFilter>
                <NumberFilter
                    minValue={0}
                    maxValue={20}
                    headline={'Kapasitet'}
                ></NumberFilter>
                <DifficultLevel></DifficultLevel>
                <ActivityBoxes></ActivityBoxes>
            </StyledContainer>
        </Drawer>
    );
};

export default SideFilterMobile;
