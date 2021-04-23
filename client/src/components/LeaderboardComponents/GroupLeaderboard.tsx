import axios from '../../Axios';
import React, { useEffect, useState } from 'react';
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
    group: Group;
}

export const GroupLeaderboard: React.FC<Props> = ({ group }: Props) => {
    const classes = useStyles();
    const [users, setUsers] = useState<User[]>([]);

    const filterPoints = (): User[] => {
        return users.sort((u1, u2) => +u1.points - +u2.points);
    };

    const getTotalPoints = (): number => {
        let sum = 0;
        users.forEach((user) => {
            sum += +user.points;
        });
        return sum;
    };

    //The max margin-left is 52rem
    const getMarginLeft = (user: User) => {
        return ((+user.points / getTotalPoints()) * 52) % 52;
    };

    return (
        <Card className={classes.root}>
            <div className="groupleaderboard__header">
                <h1>{group.name}</h1>
            </div>
            {users.map((user) => {
                <hr className="groupleaderboard__line" />;
                <div className="groupleaderboard__player">
                    <div
                        /* The max margin-left is 52rem*/
                        style={{
                            margin: `0.7rem 0.5rem 0.5rem ${getMarginLeft(
                                user
                            )}rem`,
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
                </div>;
            })}
        </Card>
    );
};
