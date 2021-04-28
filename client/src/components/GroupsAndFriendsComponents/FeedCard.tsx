import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
} from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import Group from '../../interfaces/Group';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Popup from '../Popup';
import ActivityForm from '../ActivityComponents/ActivityForm';
import { useState } from 'react';
import ActivityCard from '../ActivityComponents/ActivityCard';
import ActivityResponse from '../../interfaces/ActivityResponse';
import { useEffect } from 'react';
import axios from '../../Axios';
import User from '../../interfaces/User';
import { UserContext } from '../../UserContext';
import { useContext } from 'react';
import ActivityInformation from '../ActivityComponents/ActivityInformation';

const StyledHeader = styled.h2`
    text-align: center;
    font-size: 30px;
`;

const StyledParagraph = styled.p`
    font-size: 20px;
`;

const FeedContainer = styled.div`
    margin-left: 20px;
    min-height: 60%;
`;
const TransformDiv = styled.div`
    transition: transform 450ms;
    min-width: 200px;
    max-width: 40%;
    max-height: 40%;
    margin: 5px;
    margin-bottom: 11rem;

    :hover {
        transform: scale(1.08);
        cursor: pointer;
    }
`;

interface Props {
    selectedGroup: Group;
    updateGroups: () => void;
    leaveGroup: () => void;
}

export default function FeedCard({
    selectedGroup,
    updateGroups,
    leaveGroup,
}: Props) {
    const [openPopup, setOpenPopup] = useState<boolean>(false);
    const [openChoiceBox, setOpenChoiceBox] = useState<boolean>(false);
    const [nextActivity, setNextActivity] = useState<ActivityResponse>();
    const [openActivityPopup, setOpenActivityPopup] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User>({
        firstName: '',
        surname: '',
        userId: '',
        email: '',
        image: '',
        password: '',
        phoneNumber: '',
        activityLevel: '',
        points: '',
    });
    const { user } = useContext(UserContext);

    const getNextActivity = async () => {
        const url = `group/${selectedGroup.groupId}/activity`;
        await axios
            .get(url)
            .then(async (response) => {
                console.log(response.data['activities']);
                const nextAct = await sortNextActivity(
                    response.data['activities']
                );
                setNextActivity(nextAct);
            })
            .then(() => updateGroups())
            .catch((error) => {
                console.log(
                    'Kunne ikke hente gruppens neste aktivitet ' + error.message
                );
            });
    };

    const sortNextActivity = async (activities: ActivityResponse[]) => {
        const now = new Date().getTime();
        console.log(now);
        let currActivity = activities[0];
        activities.forEach((activity) => {
            if (activity.time < currActivity.time && activity.time >= now) {
                console.log(activity);
                console.log(currActivity);
                currActivity = activity;
            }
        });
        return currActivity;
    };

    useEffect(() => {
        getNextActivity();
    }, [selectedGroup, openPopup]);

    const handleUserClicked = (userClicked: User) => {
        if (
            Object.values(userClicked)[0].toString() !== user &&
            user === Object.values(selectedGroup.owner)[0].toString()
        ) {
            setSelectedUser(userClicked);
            setOpenChoiceBox(!openChoiceBox);
        }
    };

    const register = (activityId: number): Promise<void> => {
        return new Promise((resolve, reject) => {
            axios.delete(`/user/${user}/activity/${activityId}`);
            resolve();
        });
    };

    const unRegister = (activityId: number): Promise<void> => {
        return new Promise((resolve, reject) => {
            axios.post('/user/activity', {
                userId: user,
                activityId: activityId,
            });
            resolve();
        });
    };

    const handleLeaveGroup = () => {
        leaveGroup();
        updateGroups();
    };

    const deleteActivity = (id: number) => {
        axios
            .delete(`/activity/${id}`)
            .then(getNextActivity)
            .then(() => window.location.reload());
    };

    const handleOnChangeOwner = () => {
        const url = `/group/${selectedGroup.groupId}`
        console.log(Object.values(selectedUser)[0])
        axios.put(url, {
            "groupId": selectedGroup.groupId,
            "newOwner": Object.values(selectedUser)[0]
        }).then(response => {
            console.log(response);
        }).then(() => {
            updateGroups()
            setOpenChoiceBox(!openChoiceBox)
        }).catch(error => {
            console.log('Fikk ikke endret eier' + error.message)
        })
    }

    return selectedGroup.groupName !== '' ? (
        <FeedContainer>
            <StyledHeader>{selectedGroup.groupName}</StyledHeader>
            <List
                style={{
                    width: '40%',
                    float: 'right',
                }}
            >
                <ListSubheader>GRUPPEMEDLEMMER</ListSubheader>
                {selectedGroup.users.map((user, index) => (
                    <ListItem
                        button
                        key={index}
                        onClick={() => handleUserClicked(user)}
                    >
                        <Avatar></Avatar>
                        {Object.values(user)[0] ==
                        Object.values(selectedGroup.owner)[0] ? (
                            <ListItemText
                                primary={
                                    user.firstName +
                                    ' ' +
                                    user.surname +
                                    '(eier)'
                                }
                            />
                        ) : (
                            <ListItemText
                                primary={user.firstName + ' ' + user.surname}
                            />
                        )}
                    </ListItem>
                ))}
                <Dialog
                    open={openChoiceBox}
                    onClose={() => setOpenChoiceBox(false)}
                >
                    <DialogTitle>
                        {'Vil du gjøre' +
                            selectedUser.firstName +
                            ' ' +
                            selectedUser.surname +
                            ' til eier av gruppen?'}
                    </DialogTitle>
                    <DialogActions>
                        <Button
                            onClick={() => handleOnChangeOwner()}
                            color="primary"
                        >
                            Ja
                        </Button>
                        <Button
                            onClick={() => setOpenChoiceBox(!openChoiceBox)}
                            color="primary"
                            autoFocus
                        >
                            Nei
                        </Button>
                    </DialogActions>
                </Dialog>
            </List>
            <TransformDiv>
                {nextActivity ? (
                    <ActivityCard
                        activity={nextActivity}
                        openPopup={openActivityPopup}
                        setOpenPopup={setOpenActivityPopup}
                        setActivity={setNextActivity}
                    ></ActivityCard>
                ) : (
                    <StyledParagraph>
                        Finner ingen aktivitet aktiviteter for denne gruppen,
                        legg til en ny aktivitet!
                    </StyledParagraph>
                )}
            </TransformDiv>
            {nextActivity ? (
                <Popup
                    openPopup={openActivityPopup}
                    setOpenPopup={setOpenActivityPopup}
                    maxWidth="md"
                >
                    <ActivityInformation
                        register={register}
                        unRegister={unRegister}
                        deleteActivity={deleteActivity}
                        activity={nextActivity}
                        setOpenPopup={setOpenActivityPopup}
                        openPopup={openActivityPopup}
                    />
                </Popup>
            ) : (
                <div></div>
            )}
            <Button
                fullWidth
                onClick={() => setOpenPopup(!openPopup)}
                variant="contained"
                color="primary"
                style={{
                    position: 'relative',
                    bottom: '0',
                }}
            >
                {' '}
                Opprett en gruppeaktivitet{' '}
                <AddIcon style={{ marginLeft: '8px' }} />
            </Button>
            <Popup
                title="Legg til aktivitet"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
                maxWidth="md"
            >
                <ActivityForm
                    openPopup={openPopup}
                    setOpenPopup={setOpenPopup}
                    groupId={selectedGroup.groupId}
                />
            </Popup>
            <Button
                fullWidth
                onClick={handleLeaveGroup}
                variant="contained"
                color="primary"
                style={{
                    position: 'relative',
                    bottom: '0',
                }}
            >
                {' '}
                Forlat Gruppe <DeleteIcon style={{ marginLeft: '8px' }} />
            </Button>
        </FeedContainer>
    ) : (
        <FeedContainer>
            <h2>Ingen gruppe valgt</h2>
        </FeedContainer>
    );
}
