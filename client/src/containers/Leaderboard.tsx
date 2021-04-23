import axios from '../Axios';
import React, { useContext, useEffect, useState } from 'react';
import GroupLeaderboard from '../components/LeaderboardComponents/GroupLeaderboard';
import Group from '../interfaces/Group';
import { group } from 'node:console';
import { UserContext } from '../UserContext';

function Leaderboard() {
    const [groups, setGroups] = useState<Group[]>([]);
    const { user, seUser } = useContext(UserContext);
    const [groupId, setGroupId] = useState<string>('');
    const [group, setGroup] = useState<Group>({
        groupId: 0,
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

    //TODO test this
    const getGroupId = async () => {
        const request = await axios.get(`/user/${user}`);
        console.log(request.data);
        //TODO set the userId here if it exists
        //setGroupId()
        return request;
    };

    //TODO test this
    const getGroup = async () => {
        const request = await axios.get(`/group/${groupId}`);
        //console.log(request.data);
        //setGroup()
        return request;
    };

    const getAllGroups = async () => {
        const request = await axios.get('/group');
        console.log(request.data);
        //setGroups(request.data['groups']);
        setGroups(request.data.groups);
        return request;
    };

    useEffect(() => {
        getAllGroups();
        //getGroupId();
        //getGroup();
    }, []);

    const renderGroups = groups.map((group, index: number) => {
        return <GroupLeaderboard key={index} group={group} />;
    });

    const renderGroup = () => {
        return <GroupLeaderboard group={group} />;
    };

    return <div style={{ margin: '1rem' }}>{renderGroups}</div>;
}

export default Leaderboard;
