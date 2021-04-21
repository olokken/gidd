import React, { useState, ChangeEvent, useEffect } from 'react';
import styled from 'styled-components';
import NumberFilter from './NumberFilter';
import DifficultLevel from './DifficultLevel';
import ActivityBoxes from './ActivityBoxes';
import TimeFilter from './TimeFilter';
import DistanceFilter from './DistanceFilter';
import { TextField } from '@material-ui/core';
import ViewBox from './ViewBox';
import TagTextField from './TagTextField';

const StyledContainer = styled.div`
    margin-left: 1rem;
    margin-top: 1rem;
    width: 95%;
`;

interface Props {
    onTitleSearch: (searchResult: string) => void;
    onShowFuture: (state: boolean) => void;
    onShowMine: (state: boolean) => void;
}

const SideFilter = ({ onTitleSearch, onShowFuture, onShowMine }: Props) => {
    const [titleSearch, setTitleSearch] = useState<string>('');


    const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
        const current: string = (event.target as HTMLInputElement).value;
        setTitleSearch(current);
    };

    useEffect(() => {
        onTitleSearch(titleSearch);
    }, [titleSearch]);

    return (
        <StyledContainer>
            <TextField
                onChange={onChangeTitle}
                fullWidth={true}
                label="Søk på tittel"
                variant="outlined"
            />
            <ViewBox label={'Vis kun framtidige aktiviteter'} onStateChange={onShowFuture}></ViewBox>
            <ViewBox label={'Vis kun påmeldte aktiviteter'} onStateChange={onShowMine}></ViewBox>
            <DistanceFilter></DistanceFilter>
            <TimeFilter></TimeFilter>
            <NumberFilter
                minValue={0}
                maxValue={20}
                headline={'Kapasitet'}
            ></NumberFilter>
            <TagTextField></TagTextField>
            <DifficultLevel></DifficultLevel>
        </StyledContainer>
    );
};

export default SideFilter;
