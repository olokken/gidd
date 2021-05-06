import React, { useContext, useEffect, useState } from 'react';
import ActivityForm from '../components/ActivityComponents/ActivityForm';
import styled from 'styled-components';
import SideFilter from '../components/FilterComponents/SideFilter';
import SortMenu from '../components/SortingComponents/SortMenu';
import ActivityResponse from '../interfaces/ActivityResponse';
import ActivityGrid from '../components/ActivityComponents/ActivityGrid';
import Popup from '../components/Popup';
import AddButton from '../components/ActivityComponents/AddButton';
import { Drawer, Button } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import CloseIcon from '@material-ui/icons/Close';
import { FilterFunctions } from '../components/FilterComponents/FilterFunctions';
import axios from '../Axios';
import ActivityLevels from '../interfaces/ActivityLevels';
import { UserContext } from '../UserContext';
import DefaultCenter from '../interfaces/DefaultCenter';
import { SortFunctions } from '../components/SortingComponents/SortingFunctions';
import config from '../Config';


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
    width: 75%;
    margin-left: 3rem;
    margin-top: 10px;
    margin-right: 3rem;
`;

const Activities = () => {
    const { user } = useContext(UserContext);
    const [state, setState] = useState({
        mobileView: false,
        drawerOpen: false,
    });
    const [activities, setActivities] = useState<ActivityResponse[]>([]);
    const [currentActivities, setCurrentActivities] = useState<
        ActivityResponse[]
    >([]);
    const [openPopup, setOpenPopup] = useState<boolean>(false);
    const [titleSearch, setTitleSearch] = useState<string>('');
    const [showMine, setShowMine] = useState<boolean>(false);
    const [showFuture, setShowFuture] = useState<boolean>(false);
    const [distance, setDistance] = useState<number>();
    const [fromTime, setFromTime] = useState<Date>(new Date());
    const [toTime, setToTime] = useState<Date>(new Date());
    const [capacity, setCapacity] = useState<number[]>([0, 20]);
    const [tags, setTags] = useState<string[]>();
    const [activityLevel, setActivityLevel] = useState<ActivityLevels>({
        Low: true,
        Medium: true,
        High: true,
    });
    const [location, setLocation] = useState<DefaultCenter>();
    const [sortValue, setSortValue] = useState<number>(-1);

    const register = (activityId: number): Promise<void> => {
        console.log(activityId + ' ' + user);
        return new Promise((resolve) => {
            axios
                .post('/user/activity', {
                    userId: user,
                    activityId: activityId,
                }, config)
                .then(() => loadActivities());
            resolve();
        });
    };

    const unRegister = (activityId: number): Promise<void> => {
        return new Promise((resolve) => {
            axios
                .delete(`/user/${user}/activity/${activityId}`, config)
                .then(() => loadActivities());
            resolve();
        });
    };

    useEffect(() => {
        if (activities) {
            setCurrentActivities(activities);
            let filteredActivities = FilterFunctions.titleFilter(
                activities,
                titleSearch
            );
            filteredActivities = FilterFunctions.showMyActivities(
                filteredActivities,
                showMine,
                user
            );
            filteredActivities = FilterFunctions.showFutureActivities(
                filteredActivities,
                showFuture
            );
            filteredActivities = FilterFunctions.changeCapacity(
                filteredActivities,
                capacity
            );
            filteredActivities = FilterFunctions.dateToFilter(
                filteredActivities,
                new Date(toTime)
            );
            filteredActivities = FilterFunctions.dateFromFilter(
                filteredActivities,
                new Date(fromTime)
            );
            filteredActivities = FilterFunctions.activityLevelFilter(
                filteredActivities,
                activityLevel
            );
            filteredActivities = FilterFunctions.tagFilter(
                filteredActivities,
                tags
            );
            filteredActivities = FilterFunctions.distanceFilter(
                filteredActivities,
                distance,
                location
            );
            setCurrentActivities(filteredActivities);
        }
    }, [
        titleSearch,
        activities,
        showFuture,
        showMine,
        capacity,
        fromTime,
        toTime,
        activityLevel,
        tags,
        distance,
    ]);

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
        setCoordinates();
    }, []);

    const onClickAddButton = () => {
        setOpenPopup(!openPopup);
    };

    const deleteActivity = (id: number) => {
        axios.delete(`/activity/${id}`, config).then(loadActivities);
    };

    const setCoordinates = () => {
        fetch(
            `https://geolocation-db.com/json/${process.env.REACT_APP_GEOLOCATION_KEY}`
        )
            .then((response) => response.json())
            .then((data) => {
                if (data) {
                    const latitude: number = data.latitude;
                    const longitude: number = data.longitude;
                    console.log(latitude + ', ' + longitude);
                    setLocation({ lat: latitude, lng: longitude });
                }
            });
    };

    const reverse = () => {
        setCurrentActivities([...currentActivities].reverse());
    };

    const loadActivities = () => {
        axios
            .get(`/activity?userId=${localStorage.getItem('userID')}`)
            .then((response) => {
                response.data;
                setActivities(response.data['activities']);
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        if (sortValue == 1) {
            console.log('velger sort 1');
            const sortert = SortFunctions.comingSort(currentActivities);
            setCurrentActivities(sortert);
        } else if (sortValue == 2) {
            console.log('velger sort 2');
            const sortert = SortFunctions.distanceSort(
                currentActivities,
                location
            );
            setCurrentActivities(sortert);
        } else if (sortValue == 3) {
            console.log('velger sort 3');
            const sortert = SortFunctions.capacitySort(currentActivities);
            setCurrentActivities(sortert);
        } else if (sortValue == 4) {
            console.log('velger sort 4');
            const sortert = SortFunctions.activityLevelSort(currentActivities);
            setCurrentActivities(sortert);
        }
    }, [sortValue]);

    useEffect(loadActivities, [openPopup]);

    const displayDesktop = () => {
        return (
            <Container>
                <div style={{ width: '20%' }}>
                    <SideFilter
                        onDistanceChange={(dist) => setDistance(dist)}
                        onTimeFromChange={(time) => setFromTime(time)}
                        onTimeToChange={(time) => {
                            setToTime(time);
                        }}
                        onTitleSearch={(title) => setTitleSearch(title)}
                        onLevelChange={(level) => setActivityLevel(level)}
                        onShowFuture={(showFuture) => setShowFuture(showFuture)}
                        onShowMine={(showMine) => setShowMine(showMine)}
                        onCapacityChange={(range) => setCapacity(range)}
                        onTagsChange={(tags) => setTags(tags)}
                    ></SideFilter>
                </div>
                <View>
                    <AddAndSort>
                        <SortMenu
                            onSortChange={(val) => {
                                setSortValue(val);
                            }}
                        >
                            <Button onClick={reverse}>
                                Reverser nåværende liste
                            </Button>
                        </SortMenu>
                        <AddButton onClick={onClickAddButton}></AddButton>
                        <Popup
                            title="Legg til aktivitet"
                            openPopup={openPopup}
                            setOpenPopup={setOpenPopup}
                            maxWidth="lg"
                        >
                            <ActivityForm
                                openPopup={openPopup}
                                setOpenPopup={setOpenPopup}
                            />
                        </Popup>
                    </AddAndSort>
                    <ActivityGrid
                        register={register}
                        unRegister={unRegister}
                        deleteActivity={(id) => deleteActivity(id)}
                        activities={currentActivities}
                    ></ActivityGrid>
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
                        <SortMenu onSortChange={(val) => setSortValue(val)}>
                            <Button onClick={reverse}>
                                Reverser nåværende liste
                            </Button>
                        </SortMenu>
                        <Button
                            style={{
                                border: '1px solid lightgrey',
                                marginTop: '5px',
                            }}
                            onClick={handleDrawerOpen}
                        >
                            Filtrer søk
                        </Button>
                        <Drawer
                            style={{ width: '50px' }}
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
                                <SideFilter
                                    onDistanceChange={(dist) =>
                                        setDistance(dist)
                                    }
                                    onTimeFromChange={(time) =>
                                        setFromTime(time)
                                    }
                                    onTimeToChange={(time) => {
                                        setToTime(time);
                                    }}
                                    onTitleSearch={(title) =>
                                        setTitleSearch(title)
                                    }
                                    onShowFuture={(showFuture) =>
                                        setShowFuture(showFuture)
                                    }
                                    onShowMine={(showMine) =>
                                        setShowMine(showMine)
                                    }
                                    onCapacityChange={(range) =>
                                        setCapacity(range)
                                    }
                                    onTagsChange={(tags) => setTags(tags)}
                                    onLevelChange={(level) =>
                                        setActivityLevel(level)
                                    }
                                ></SideFilter>
                            </div>
                        </Drawer>
                        <AddButton onClick={onClickAddButton}></AddButton>
                        <Popup
                            title="Legg til aktivitet"
                            openPopup={openPopup}
                            setOpenPopup={setOpenPopup}
                            maxWidth="md"
                        >
                            <ActivityForm
                                openPopup={openPopup}
                                setOpenPopup={setOpenPopup}
                            />
                        </Popup>
                    </AddAndSort>
                    <ActivityGrid
                        register={register}
                        unRegister={unRegister}
                        deleteActivity={(id) => deleteActivity(id)}
                        activities={currentActivities}
                    ></ActivityGrid>
                </View>
            </Container>
        );
    };

    return <div>{mobileView ? displayMobile() : displayDesktop()}</div>;
};

export default Activities;
