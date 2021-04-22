import axios from 'axios';
import React from 'react';
import Group from '../../interfaces/Group';

interface Props {
    group: Group;
}

export const GroupLeaderboard: React.FC<Props> = ({ group }: Props) => {
    const getPoints = async () => {
        //TODO: the url get the group.
        const request = await axios.get('/group');
    };
    return <div></div>;
};
