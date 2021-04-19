import { GridList } from '@material-ui/core';
import Pageination from '@material-ui/lab/Pagination';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Activity from '../../interfaces/Activity';
import Popup from '../Popup';
import ActivityCard from './ActivityCard';
import ActivityInformation from './ActivityInformation';
import ActivityInformationPopup from './ActivityInformationPopup';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

interface Props {
    activities: Activity[];
}

const ActivityGrid = ({ activities }: Props) => {
    const [page, setPage] = useState<number>(1);
    const [currentActivities, setCurrentActivities] = useState<Activity[]>(activities);
    const [openPopup, setOpenPopup] = useState<boolean>(false);

    useEffect(() => {
        const startIndex = (page - 1) * 24;
        const endIndex = page * 24;
        setCurrentActivities(activities.slice(startIndex, endIndex));
    }, [page, activities]);

    const [activity, setActivity] = useState<Activity>({
        ID: 0,
        title: '',
        time: '',
        //repeat: number;
        //userID: number;
        owner: '',
        capacity: 0,
        maxCapacity: 0,
        //groupId: number;
        description: '',
        level: '',
        //latitude: number;
        //longitude: number;
        //picture: any;
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
            <ActivityInformationPopup
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
                <ActivityInformation activity={activity} />
            </ActivityInformationPopup>
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
