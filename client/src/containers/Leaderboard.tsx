import axios from '../Axios';
import React, { useEffect, useState } from 'react';
import { GroupLeaderboard } from '../components/LeaderboardComponents/GroupLeaderboard';
import Group from '../interfaces/Group';

function Leaderboard() {
    const [groups, setGroups] = useState<Group[]>([]);

    const getAllGroups = async () => {
        const request = await axios.get('/group');
        console.log(request);
        setGroups(request.data.groups);
        return request;
    };

    useEffect(() => {
        getAllGroups();
    }, []);

    return (
        <div style={{ margin: '1rem' }}>
            {groups.map((group) => {
                <GroupLeaderboard group={group} />;
            })}
        </div>
    );
}

export default Leaderboard;
