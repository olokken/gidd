import axios from '../Axios';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import GroupLeaderboard from '../components/LeaderboardComponents/GroupLeaderboard';
import Group from '../interfaces/Group';
import { UserContext } from '../UserContext';
import { makeStyles, Paper, Tab, Tabs } from '@material-ui/core';
import User from '../interfaces/User';
import { Groups } from '../components/GroupsAndFriendsComponents/Groups';
import config from '../Config';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});

function Leaderboard() {
    const classes = useStyles();
    const { user } = useContext(UserContext);
    const [yourGroups, setYourGroups] = useState<Group[]>([]);
    const [value, setValue] = React.useState(0);
    const [friends, setFriends] = useState<User[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group>({
        owner: {
            firstName: '',
            surname: '',
            userId: '',
            email: '',
            image: '',
            password: '',
            phoneNumber: '',
            activityLevel: '',
            points: '',
        },
        groupName: '',
        groupId: '',
        users: [],
    });

    const getYourGroups = async () => {
        const request = await axios.get(`/user/${user}/group`, config);
        setYourGroups(request.data.groups);
        return request;
    };

    const getFriends = async () => {
        const request = await axios.get(`/user/${user}/user`, config);
        return request;
    };

    const getUser = async () => {
        const request = await axios.get(`/user/${user}`, config);
        return request;
    };

    const handleChange = (
        event: ChangeEvent<Record<string, unknown>>,
        newValue: number
    ) => {
        setValue(newValue);
    };

    const handleGroupClicked = (group: Group) => {
        setSelectedGroup(group);
    };

    useEffect(() => {
        Promise.all([getFriends(), getUser()]).then((response) => {
            setFriends(response[0].data.users);
            setFriends((friends) => [...friends, response[1].data]);
        });
        getYourGroups();
    }, []);

    return (
        <div style={{ margin: '1rem' }}>
            <div>
                <Paper className={classes.root}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab label="Dine venner"></Tab>
                        <Tab label="Dine grupper"></Tab>
                    </Tabs>
                </Paper>
            </div>
            <div>
                <div>
                    {value === 0 && (
                        <div>
                            <GroupLeaderboard
                                users={friends}
                                title="Dine venner"
                            />
                        </div>
                    )}
                </div>
                {value === 1 && (
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '20%' }}>
                            {yourGroups.length === 0 ? (
                                <h5>
                                    Du har ingen grupper enda. Vennligst legg
                                    til under <q>grupper og venner</q>
                                </h5>
                            ) : (
                                <div>
                                    <h2>Dine grupper</h2>
                                    <Groups
                                        groups={yourGroups}
                                        handleGroupClicked={handleGroupClicked}
                                    />
                                </div>
                            )}
                        </div>
                        {selectedGroup.groupId !== '' && (
                            <div style={{ flex: '1' }}>
                                <GroupLeaderboard
                                    users={selectedGroup.users}
                                    title={selectedGroup.groupName}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Leaderboard;
