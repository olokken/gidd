import { Container, GridList } from '@material-ui/core';
import React, { useState } from 'react';
import User from '../../interfaces/User';
import PersonCard from './PersonCard';

interface Props {
    people: User[];
}

const CompetitorList = ({ people }: Props) => {
    const [currentPeople, setCurrentPeople] = useState<
        User[]
    >(people);
    const renderPeople = currentPeople.map((per, index: number) => {
        return (
            <PersonCard
                key={index}
                person={per}
            ></PersonCard>
        );
    });
    return(
        <Container>
            <GridList
                    cellHeight={40}
                    cols={1}
                    style={{ display: 'flex', justifyContent: 'center' }}
                >
                    {renderPeople}
            </GridList>
        </Container>
    )
}

export default CompetitorList;