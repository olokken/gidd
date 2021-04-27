import axios from '../Axios';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import GroupLeaderboard from '../components/LeaderboardComponents/GroupLeaderboard';
import Group from '../interfaces/Group';
import { UserContext } from '../UserContext';
import { makeStyles, Paper, Tab, Tabs } from '@material-ui/core';
import User from '../interfaces/User';
import { Groups } from '../components/GroupsAndFriendsComponents/Groups';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});

function Leaderboard() {
    const classes = useStyles();
    const [groups, setGroups] = useState<Group[]>([]);
    const { user, seUser } = useContext(UserContext);
    const [yourGroups, setYourGroups] = useState<Group[]>([]);
    const [value, setValue] = React.useState(0);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [friends, setFriends] = useState<User[]>([]);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedGroup, setSelectedGroup] = useState<Group>({
        owner: {
            firstName: '',
            surname: '',
            userID: '',
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
        const request = await axios.get(`/user/${user}/group`);
        setYourGroups(request.data.groups);
        return request;
    };

    const getFriends = async () => {
        const request = await axios.get(`/user/${user}/user`);
        return request;
    };

    const getUser = async () => {
        const request = await axios.get(`/user/${user}`);
        return request;
    };

    const getAllGroups = async () => {
        const request = await axios.get('/group');
        setGroups(request.data.groups);
        return request;
    };

    const getAllUsers = async () => {
        const request = await axios.get('/user');
        setAllUsers(request.data);
        return request;
    };

    const handleChange = (
        event: ChangeEvent<Record<string, unknown>>,
        newValue: number
    ) => {
        setValue(newValue);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleGroupClicked = (group: Group) => {
        setSelectedGroup(group);
    };

    useEffect(() => {
        getYourGroups();
        Promise.all([getFriends(), getUser()]).then((response) => {
            setFriends(response[0].data.users);
            setFriends((friends) => [...friends, response[1].data]);
        });
        getAllGroups();
        getAllUsers();
    }, []);

    const renderAllGroups = groups.map((group, index: number) => {
        return (
            <GroupLeaderboard
                key={index}
                users={group.users}
                title={group.groupName}
            />
        );
    });

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
                        <Tab onClick={handleClick} label="Dine grupper"></Tab>
                        <Tab label="Dine venner"></Tab>
                        <Tab label="Alle grupper"></Tab>
                        <Tab label="Alle brukere"></Tab>
                    </Tabs>
                </Paper>
            </div>
            <div>
                {value === 0 && (
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '20%' }}>
                            <h2>Dine grupper</h2>
                            <Groups
                                groups={yourGroups}
                                handleGroupClicked={handleGroupClicked}
                            />
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
            <div>
                {value === 1 && (
                    <div>
                        <GroupLeaderboard users={friends} title="Dine venner" />
                    </div>
                )}
            </div>
            <div>{value === 2 && <div>{renderAllGroups}</div>}</div>
            <div>
                {value === 3 && (
                    <div>
                        <GroupLeaderboard
                            users={allUsers}
                            title="Alle brukere"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Leaderboard;
