import { GridList } from '@material-ui/core';
import Pageination from '@material-ui/lab/Pagination';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Activity from '../../interfaces/Activity';
import ActivityCard from './ActivityCard';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

interface Props {
    activities: Activity[];
}

const ActivityGrid = ({ activities }: Props) => {
    return (
        <Container>
            <h2>Tilgjengelige Aktiviteter</h2>
            <GridList
                cellHeight={160}
                cols={3}
                style={{ display: 'flex', justifyContent: 'center' }}
            >
                {activities.map((act, index) => (
                    <ActivityCard
                        key={index}
                        ID={act.ID}
                        title={act.title}
                        time={act.time}
                        owner={act.owner}
                        capacity={act.capacity}
                        maxCapacity={act.maxCapacity}
                        description={act.description}
                        level={act.level}
                    ></ActivityCard>
                ))}
            </GridList>
            <Pageination
                style={{ justifyContent: 'center', display: 'flex' }}
                count={Math.ceil(activities.length / 36)}
                size="large"
            />
        </Container>
    );
};

export default ActivityGrid;
