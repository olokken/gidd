import axios from '../../Axios';
import React, { useState } from 'react';
import Group from '../../interfaces/Group';
import User from '../../interfaces/User';
import { Avatar, Card, CardContent, makeStyles } from '@material-ui/core';
import './GroupLeaderboard.css';

const useStyles = makeStyles({
    root: {
        minWidth: 150,
        margin: '3rem 1rem',
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});
interface Props {
    group?: Group;
}

export const GroupLeaderboard: React.FC<Props> = ({ group }: Props) => {
    const classes = useStyles();
    const [members, setMembers] = useState<User[]>([]);
    //TODO work with this method.
    const getPoints = async () => {
        //TODO: the url get the group.
        const request = await axios.get('/group');
    };

    /*
    const filterPoints = () => {
        return members.sort((m1, m2) => m1.points - m2.points);
    };

    const getTotalPoints = () => {
        return members.reduce((m1, m2) => m1.points + m2.points);
    };
    */

    //The max margin-left is 52rem
    const getMarginLeft1 = () => {
        //(userpoints/totalpoints)%52
        return ((100 / 150) * 52) % 52;
    };
    const getMarginLeft2 = () => {
        //(userpoints/totalpoints)%52
        return ((50 / 150) * 52) % 52;
    };

    return (
        <Card className={classes.root}>
            <div className="groupleaderboard__header">
                <h1>{group ? group.name : 'hei'}</h1>
            </div>
            <hr className="groupleaderboard__line" />
            <div className="groupleaderboard__player">
                <div
                    /* The max margin-left is 52rem*/
                    style={{
                        margin: `0.7rem 0.5rem 0.5rem ${getMarginLeft1()}rem`,
                        flex: '1',
                    }}
                >
                    <div className="groupleaderboard__logo">
                        <h6 className="groupleaderboard__name">William</h6>
                        <Avatar />
                    </div>
                </div>
                <div className="groupleaderboard__stats">
                    <h5 className="groupleaderboard__stat1">3rd Place</h5>
                    <h5 className="groupleaderboard__stat2">100 points</h5>
                </div>
            </div>
            <hr className="groupleaderboard__line" />
        </Card>
    );
};
