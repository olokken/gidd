import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Activity from '../../interfaces/Activity';
import ActivityCard from './ActivityCard';

const Container = styled.div``;

interface Props {
    activities: Activity[];
}

const ActivityGrid = ({ activities }: Props) => {

    return (
        <Container>
            <h3>Her skal det komme masse aktiviteter</h3>
            {activities.map((act) => (
                <ActivityCard
                    key={act.ID}
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
        </Container>
    );
};

export default ActivityGrid;
