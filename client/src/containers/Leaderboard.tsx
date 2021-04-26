import axios from '../Axios';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import GroupLeaderboard from '../components/LeaderboardComponents/GroupLeaderboard';
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

    const getYourGroups = async () => {
        const request = await axios.get(`/user/${user}/group`);
        setYourGroups(request.data.groups);
        return request;
    };

    const getFriends = async () => {
        const request = await axios.get(`/user/${user}/user`);
        setFriends(request.data.users);
        return request;
    };

    const getUser = async () => {
        const request = await axios.get(`/user/${user}`);
        setFriends((friends) => [...friends, request.data]);
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

    useEffect(() => {
        getYourGroups();
        getFriends();
        getUser();
        getAllGroups();
        getAllUsers();
    }, []);

    const renderAllGroups = groups.map((group, index: number) => {
        return (
            <GroupLeaderboard
                key={index}
                propUsers={group.users}
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
                    <div>
                        <GroupMenu
                            anchorEl={anchorEl}
                            setAnchorEl={setAnchorEl}
                            groups={yourGroups}
                            setGroup={setGroup}
                        />
                        {group !== undefined && (
                            <GroupLeaderboard
                                propUsers={group.users}
                                title={group.groupName}
                            />
                        )}
                    </div>
                )}
            </div>
            <div>
                {value === 1 && (
                    <div>
                        <GroupLeaderboard
                            propUsers={friends}
                            title="Dine venner"
                        />
                    </div>
                )}
            </div>
            <div>{value === 2 && <div>{renderAllGroups}</div>}</div>
            <div>
                {value === 3 && (
                    <div>
                        <GroupLeaderboard
                            propUsers={allUsers}
                            title="Alle brukere"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Leaderboard;
