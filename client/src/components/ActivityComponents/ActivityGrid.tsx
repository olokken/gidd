import { GridList } from '@material-ui/core';
import Pageination from '@material-ui/lab/Pagination';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ActivityResponse from '../../interfaces/ActivityResponse';
import Popup from '../Popup';
import ActivityCard from './ActivityCard';
import ActivityInformation from './ActivityInformation'; 


const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

interface Props {
    activities: ActivityResponse[];
}

const ActivityGrid = ({ activities }: Props) => {
    const [page, setPage] = useState<number>(1);
    const [currentActivities, setCurrentActivities] = useState<
        ActivityResponse[]
    >(activities);
    const [openPopup, setOpenPopup] = useState<boolean>(false);

    useEffect(() => {
        const startIndex = (page - 1) * 24;
        const endIndex = page * 24;
        setCurrentActivities(activities.slice(startIndex, endIndex));
    }, [page, activities]);

    const [activity, setActivity] = useState<ActivityResponse>({
        activityId: 0,
        activityLevel: 'MEDIUM',
        capacity: 0,
        daysToRepeat: 0,
        description: 'test',
        equipments: [],
        groupId: 0,
        image: '',
        latitude: 0,
        longitude: 0,
        registeredParticipants: [],
        tags: ['SII'],
        time: 1618924200000,
        timeCreated: 1618830691000,
        title: 'Test',
        user:{},
    });

    const renderActivities = currentActivities.map((act, index: number) => {
        return (
            <ActivityCard
                key={index}
                activity={act}
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
                setActivity={setActivity}
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
                style={{ display: 'flex', justifyContent: 'center' }}
            >
                {renderActivities}
            </GridList>
            <Popup openPopup={openPopup} setOpenPopup={setOpenPopup} maxWidth='md'>
                <ActivityInformation activity={activity}></ActivityInformation>
            </Popup>
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
