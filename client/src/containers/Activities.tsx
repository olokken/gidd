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
import Popup from '../components/Popup'
import AddButton from '../components/ActivityComponents/AddButton'; 
import {Drawer,Button} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';



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
    const [state, setState] = useState({
        mobileView: false,
        drawerOpen: false,
    });
    const { mobileView, drawerOpen } = state;
    useEffect(() => {
        const setResponsiveness = () => {
            return window.innerWidth < 951
                ? setState((prevState) => ({ ...prevState, mobileView: true }))
                : setState((prevState) => ({
                      ...prevState,
                      mobileView: false,
                  }));
        };
        setResponsiveness();
        window.addEventListener('resize', () => setResponsiveness());
    }, []);
    
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

    const displayDesktop = () => {
            return (
                <Container>
                    <div style={{width:"20%"}}>
                    <SideFilter ></SideFilter>
                    </div>
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

        const displayMobile = () => {
            const handleDrawerOpen = () =>
            setState((prevState) => ({ ...prevState, drawerOpen: true }));

        const handleDrawerClose = () =>
            setState((prevState) => ({ ...prevState, drawerOpen: false }));
            return (
                <Container>
                    <View>
                        <AddAndSort>
                            <SortMenu></SortMenu>
                            <Button style={{border: '1px solid lightgrey', marginTop:'5px'}} onClick={handleDrawerOpen}>Filtrer søk</Button>
                            <Drawer
                                style={{width:'50px'}}
                                {...{
                                    anchor: 'bottom',
                                    open: drawerOpen,
                                    onClose: handleDrawerClose,
                                }}
                            >
                                <br />
                                <IconButton
                                    style={{
                                    position: 'absolute',
                                    top: '5px',
                                    right: '0',
                                    }}
                                    onClick={handleDrawerClose}
                                >
                                <CloseIcon />
                                </IconButton>
                                <b style={{ textAlign: 'center' }}>Fliter</b>
                                <Divider
                                    style={{
                                    marginTop: '20px',
                                }}
                                />  
                                <div style={{ padding: '10px' }}>
                                    <SideFilter></SideFilter>
                                </div>
                            </Drawer>
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

    return (
        <div>
            {mobileView ? displayMobile() : displayDesktop()}
        </div>
    );
};

export default Activities;
