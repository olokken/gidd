import { Avatar, Button, List, ListItem, ListItemText, ListSubheader } from '@material-ui/core'
import React from 'react'
import styled from 'styled-components'
import Group from '../../interfaces/Group'
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Popup from '../Popup';
import ActivityForm from '../ActivityComponents/ActivityForm';
import { useState } from 'react';
import ActivityCard from '../ActivityComponents/ActivityCard';
import ActivityResponse from '../../interfaces/ActivityResponse';
import { useEffect } from 'react';
import axios from '../../Axios'



const FeedContainer = styled.div`
    margin-left:20px;
    border:1px solid black;
    min-height:80%;
`
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
    selectedGroup: Group;
    leaveGroup: () => void;
}


export default function FeedCard({ selectedGroup, leaveGroup }: Props) {
    const [openPopup, setOpenPopup] = useState<boolean>(false);
    const [nextActivity, setNextActivity] = useState<ActivityResponse>();

    useEffect(() => {
        const getNextActivity = async () => {
            const url = `activity/302425350`
            await axios.get(url).then(response => {
                console.log(response.data)
                setNextActivity(response.data)
            }).catch(error => {
                console.log('Kunne ikke hente gruppens neste aktivitet ' + error.message)
            })
        }
        getNextActivity()
    }, []);

    return (
        selectedGroup.groupName !== '' ?
            <FeedContainer>
                <h2>{selectedGroup.groupName}</h2>
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
                            onClick={() => console.log(user)}>
                            <Avatar></Avatar>
                            {Object.values(user)[0] == Object.values(selectedGroup.owner)[0] ?
                                <ListItemText
                                    primary={
                                        user.firstName + ' ' + user.surname + '(eier)'
                                    } /> :
                                <ListItemText
                                    primary={
                                        user.firstName + ' ' + user.surname} />
                            }
                        </ListItem>
                    ))}
                </List>
                <TransformDiv>
                    <h4>Kommende aktivitet:</h4>
                    {nextActivity ?
                        <ActivityCard
                            activity={nextActivity}
                            openPopup={openPopup}
                            setOpenPopup={setOpenPopup}></ActivityCard> :
                        <p>Finner ingen aktivitet aktiviteter for denne gruppen</p>}
                </TransformDiv>
                <Button
                    fullWidth
                    onClick={() => setOpenPopup(!openPopup)}
                    variant="contained"
                    color="primary"
                    style={{
                        position: 'relative',
                        bottom: '0'
                    }
                    }
                > Opprett en gruppeaktivitet <AddIcon style={{ marginLeft: "8px" }} />
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
                    onClick={leaveGroup}
                    variant="contained"
                    color="primary"
                    style={{
                        position: 'relative',
                        bottom: '0'
                    }
                    }
                >  Forlat Gruppe <DeleteIcon style={{ marginLeft: "8px" }} />
                </Button>
            </FeedContainer> :
            <FeedContainer>
                <h2>Ingen gruppe valgt</h2></FeedContainer>

    )
}
