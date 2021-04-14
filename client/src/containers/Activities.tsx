import React, {
    ChangeEvent,
    KeyboardEventHandler,
    useEffect,
    useState,
} from 'react';
import { TextField, Button } from '@material-ui/core';
import styled from 'styled-components';
import SideFilter from '../components/Filters/SideFilter';
import SortMenu from '../components/Sorting/SortMenu';
import AddBox from '@material-ui/icons/AddBox';
import Activity, { ActivityList } from '../interfaces/Activity';
import ActivityGrid from '../components/ActivityComponents/ActivityGrid';
import ActivityCard from '../components/ActivityComponents/ActivityCard';

//Endringer kan forekomme her

const Container = styled.div`
    display: flex;
    margin-left: 10px;
    width: 100%;
`;

const AddAndSort = styled.div`
    display: flex;
    justify-content: space-between;
`;

const View = styled.div`
    display: flex;
    flex-direction: column;
    width: 75%;
    margin-left: 2rem;
`;

const Activities = () => {
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        const Liste = ActivityList();
        //Kode for å hente ut alle aktiviteter
        setActivities(Liste);
    }, []);

    const onClick = () => {
        console.log(activities);
    };

    return (
        <Container>
            <SideFilter></SideFilter>
            <View>
                <AddAndSort>
                    <SortMenu></SortMenu>
                    <AddBox
                        onClick={onClick}
                        style={{
                            width: '3rem',
                            height: '3rem',
                            marginTop: '0.5rem',
                        }}
                    ></AddBox>
                </AddAndSort>
                <ActivityGrid activities={activities}></ActivityGrid>
            </View>
        </Container>
    );
};

export default Activities;
