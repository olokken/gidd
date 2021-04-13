import React from 'react';
import styled from 'styled-components';
import NumberFilter from './NumberFilter';
import DifficultLevel from './DifficultLevel';
import ActivityBoxes from './ActivityBoxes';
import TimeFilter from './TimeFilter';
import DistanceFilter from './DistanceFilter';

const StyledContainer = styled.div`
    padding-left: 10px;
    width: 20%;
`;

const SideFilter = () => {
    return (
        <StyledContainer>
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
    );
};

export default SideFilter;
