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
import ActivityGrid from '../components/ActivityComponents/ActivityGrid';
import Popup from '../components/Popup';
import AddButton from '../components/ActivityComponents/AddButton';

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
    const [activities, setActivities] = useState<Activity[]>([]);
    const [openPopup, setOpenPopup] = useState<boolean>(false);

    const onClickAddButton = () => {
        setOpenPopup(!openPopup);
    };

    useEffect(() => {
        const Liste = ActivityList();
        //Kode for å hente ut alle aktiviteter
        setActivities(Liste);
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
                        maxWidth="lg"
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
