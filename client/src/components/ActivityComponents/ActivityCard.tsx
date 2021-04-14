import { Card, CardActionArea } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import Activity from '../../interfaces/Activity';

const ActivityCard = ({
    ID,
    title,
    time,
    owner,
    capacity,
    maxCapacity,
    description,
    level,
}: Activity) => {
    return (
        <Card>
            <CardActionArea>
                <h4>{title}</h4>
                <label>{description}</label>
                <label>{time.toISOString}</label>
            </CardActionArea>
        </Card>
    );
};

export default ActivityCard;
