import React, {
    ChangeEvent,
    KeyboardEventHandler,
    useEffect,
    useState,
} from 'react';
import ActivityForm from '../components/ActivityComponents/ActivityForm';
import styled from 'styled-components';
import SideFilter from '../components/FilterComponents/SideFilter';
import SortMenu from '../components/SortingComponents/SortMenu';
import Activity, { ActivityList } from '../interfaces/Activity';
import ActivityResponse from '../interfaces/ActivityResponse';
import ActivityGrid from '../components/ActivityComponents/ActivityGrid';
import Popup from '../components/Popup';
import AddButton from '../components/ActivityComponents/AddButton';
import axios from '../Axios';
import { Button } from '@material-ui/core';

//Endringer kan forekomme her

const Container = styled.div`
    display: flex;
    margin-left: 10px;
    width: 100%;
`;

const AddAndSort = styled.div`
    display: flex;
    justify-content: space-between;

    @media only screen and (max-width: 951px) {
        flex-direction: column-reverse;
    }
`;

const View = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 75%;
    margin-left: 3rem;
    margin-top: 10px;
    margin-right: 3rem;
`;

const Activities = () => {
    const [activities, setActivities] = useState<ActivityResponse[]>([]);
    const [openPopup, setOpenPopup] = useState<boolean>(false);

    const onClickAddButton = () => {
        setOpenPopup(!openPopup);
    };

    useEffect(() => {
        axios
            .get('/activity')
            .then((response) => {
                console.log(response.data['activity']);
                setActivities(response.data['activity']);
            })
            .catch((error) => console.log(error));
    }, []);

    return (
        <Container>
            <SideFilter></SideFilter>
            <View>
                <AddAndSort>
                    <SortMenu></SortMenu>
                    <AddButton onClick={onClickAddButton}></AddButton>
                    <Popup
                        title="Legg til aktivitet"
                        openPopup={openPopup}
                        setOpenPopup={setOpenPopup}
                        maxWidth="sm"
                        fullWidth={true}
                    >
                        <ActivityForm
                            openPopup={openPopup}
                            setOpenPopup={setOpenPopup}
                        />
                    </Popup>
                </AddAndSort>
                <ActivityGrid activities={activities}></ActivityGrid>
            </View>
        </Container>
    );
};

export default Activities;
