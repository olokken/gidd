import axios from '../Axios';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import GroupLeaderboard, {
    Placements,
} from '../components/LeaderboardComponents/GroupLeaderboard';
import Group from '../interfaces/Group';
import { group } from 'node:console';
import { UserContext } from '../UserContext';
import {
    makeStyles,
    Menu,
    MenuItem,
    Paper,
    Tab,
    Tabs,
} from '@material-ui/core';
import User from '../interfaces/User';
import GroupMenu from '../components/LeaderboardComponents/GroupMenu';
import GroupList from '../components/GroupsAndFriendsComponents/GroupList';
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
    const [group, setGroup] = useState<Group>({
        groupId: '0',
        groupName: '',
        owner: {
            firstName: '',
            surname: '',
            userID: '',
            email: '',
            picture: '',
            password: '',
            phoneNumber: '',
            activityLevel: '',
            points: '',
        },
        users: [],
    });
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
            picture: '',
            password: '',
            phoneNumber: '',
            activityLevel: '',
            points: '',
        },
        groupName: '',
        groupId: '',
        users: [],
    });
    const [users, setUsers] = useState<User[]>([]);
    const [placements, setPlacements] = useState<Placements[]>([]);
    const [totalPoints, setTotalPoints] = useState<number>(0);

    const getYourGroups = async () => {
        const request = await axios.get(`/user/${user}/group`);
        setYourGroups(request.data.groups);
        return request;
    };

    const getFriends = async () => {
        const request = await axios.get(`/user/${user}/user`);
        //setFriends(request.data.users);
        return request;
    };

    const getUser = async () => {
        const request = await axios.get(`/user/${user}`);
        //setFriends((friends) => [...friends, request.data]);
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
    const updateGroups = () => {
        const url = `user/${user}/group`;
        axios
            .get(url)
            .then((response) => {
                setGroups(response.data['groups']);
            })
            .then(() =>
                groups.forEach((group) => {
                    if (group.groupId === selectedGroup.groupId) {
                        setSelectedGroup(group);
                    }
                })
            )
            .catch((error) => {
                console.log('Kunne ikke hente dine grupper' + error.message);
            });
    };

    const handleGroupClicked = (group: Group) => {
        console.log(group);
        setSelectedGroup(group);
    };

    useEffect(() => {
        getYourGroups();
        Promise.all([getFriends(), getUser()]).then((response) => {
            //console.log(response[0].data.users);
            setFriends(response[0].data.users);
            setFriends((friends) => [...friends, response[1].data]);
        });
        getAllGroups();
        getAllUsers();
        updateGroups();
    }, []);

    /*
    useEffect(() => {
        console.log(selectedGroup.users);
        setUsers(selectedGroup.users);
    }, [selectedGroup]);
    */

    const renderAllGroups = groups.map((group, index: number) => {
        return (
            <GroupLeaderboard
                key={index}
                users={group.users}
                setUsers={setUsers}
                title={group.groupName}
                placements={placements}
                setPlacements={setPlacements}
                totalPoints={totalPoints}
                setTotalPoints={setTotalPoints}
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
                                    setUsers={setUsers}
                                    title={selectedGroup.groupName}
                                    placements={placements}
                                    setPlacements={setPlacements}
                                    totalPoints={totalPoints}
                                    setTotalPoints={setTotalPoints}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div>
                {value === 1 && (
                    <div>
                        <GroupLeaderboard
                            users={friends}
                            setUsers={setUsers}
                            title="Dine venner"
                            placements={placements}
                            setPlacements={setPlacements}
                            totalPoints={totalPoints}
                            setTotalPoints={setTotalPoints}
                        />
                    </div>
                )}
            </div>
            <div>{value === 2 && <div>{renderAllGroups}</div>}</div>
            <div>
                {value === 3 && (
                    <div>
                        <GroupLeaderboard
                            users={allUsers}
                            setUsers={setUsers}
                            title="Alle brukere"
                            placements={placements}
                            setPlacements={setPlacements}
                            totalPoints={totalPoints}
                            setTotalPoints={setTotalPoints}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Leaderboard;
