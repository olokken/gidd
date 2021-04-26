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

const TransformDiv = styled.div`
    transition: transform 450ms;
    min-width: 200px;
    max-width: 29%;
    margin: 5px;
    margin-bottom: 11rem;

    :hover {
        transform: scale(1.08);
    }
`;

interface Props {
    activities: ActivityResponse[];
    deleteActivity: (id: number) => void;
    register: (id: number) => Promise<void>;
    unRegister: (id: number) => Promise<void>;
}

const ActivityGrid = ({
    activities,
    deleteActivity,
    register,
    unRegister,
}: Props) => {
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
        user: {},
    });

    const renderActivities = currentActivities.map((act, index: number) => {
        return (
            <TransformDiv key={index}>
                <ActivityCard
                    activity={act}
                    openPopup={openPopup}
                    setOpenPopup={setOpenPopup}
                    setActivity={setActivity}
                ></ActivityCard>
            </TransformDiv>
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
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '2rem',
                }}
            >
                {renderActivities}
            </GridList>
            <Popup
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
                maxWidth="md"
            >
                <ActivityInformation
                    register={register}
                    unRegister={unRegister}
                    deleteActivity={deleteActivity}
                    openPopup={openPopup}
                    setOpenPopup={setOpenPopup}
                    activity={activity}
                ></ActivityInformation>
            </Popup>
            <Pageination
                style={{
                    justifyContent: 'center',
                    display: 'flex',
                }}
                onChange={onPageChange}
                count={Math.ceil(activities.length / 24)}
                size="large"
            />
        </Container>
    );
};

export default ActivityGrid;
