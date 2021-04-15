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
    const [page, setPage] = useState<number>(0);
    const [currentActivities, setCurrentActivities] = useState<Activity[]>(activities);

    useEffect(() => {
        setPage(1); 
    }, [])

    useEffect(() => {
        const startIndex = (page - 1) * 24; 
        const endIndex = page*24; 
        setCurrentActivities(activities.slice(startIndex, endIndex)); 
    }, [page]); 

    const renderActivities = currentActivities.map((act, index) => {
        return (
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
        );
    });

    const onPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <Container>
            <h2>Tilgjengelige Aktiviteter</h2>
            <GridList
                cellHeight={160}
                cols={3}
                style={{ display: 'flex', justifyContent:'center' }}
            >
                {renderActivities}
            </GridList>
            <Pageination
                style={{ justifyContent: 'center', display: 'flex' }}
                onChange={onPageChange}
                count={Math.ceil(activities.length / 24)}
                size="large"
            />
        </Container>
    );
};

export default ActivityGrid;
