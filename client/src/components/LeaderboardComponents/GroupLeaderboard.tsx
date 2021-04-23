import React, { useState } from 'react';
import Group from '../../interfaces/Group';
import User from '../../interfaces/User';
import { Avatar, Card, makeStyles } from '@material-ui/core';
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

interface Placements {
    userId: string;
    position: number;
}

const GroupLeaderboard: React.FC<Props> = ({ group }: Props) => {
    const [users, setUsers] = useState<User[]>(group.users);
    const classes = useStyles();

    const most = () => {
        let index = 0;
        for (let i = 0; i < users.length; i++) {
            for (let y = i + 1; y < users.length; y++) {
                if (+users[i].points > +users[y].points) index = i;
            }
        }
        return index;
    };
    /*
    const getPlacements = () => {
        let arr: Placements[] = [];
        let indexes: number[] = [];
        let index = 0;
        let max = 1000000000;
        let nextPlacement = 0;
        for (let i = 0; i < users.length; i++) {
            for (let y = i + 1; y < users.length; y++) {
                if (+users[i].points > +users[y].points) {
                    index = i;
                } 
                if(y === users.length-1) {
                    for(let k=y-1; k >=0; k--) {
                        let ind = 0;
                        let arr1: Placements[] = [];
                        if(+users[index].points === +users[k].points) {
                            nextPlacement++;
                            arr1[ind++] = 
                        }
                        if(k===0)
                    }
                }
            }
        }
    };

    const filterPoints = () => {
        const sortArray = users.map(function (data, index) {
            return { index: index, data: data };
        });

        sortArray.sort(function (a, b) {
            if (a.data < b.data) return -1;
            if (a.data > b.data) return 1;
            return a.index - b.index;
        });

        return sortArray.map(function (val) {
            return val.data;
        });
    };

    const getPosition = (user: User): number => {
        console.log(Object.values(user)[0]);
        const filtered = filterPoints();
        filtered.forEach((f) => console.log(f));
        return filtered.indexOf(user);
        //return -1;
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

    const renderPlayers = group.users.map((user, index: number) => {
        return (
            <div className="groupleaderboard__players" key={index}>
                <hr className="groupleaderboard__line" />
                <div className="groupleaderboard__player">
                    <div
                        /* The max margin-left is 52rem*/
                        style={{
                            margin: `0.7rem 0.5rem 0.5rem `,
                            marginLeft: `${getMarginLeft(user)}rem`,
                            display: 'flex',
                            flex: '1',
                        }}
                    >
                        <h6 className="groupleaderboard__name">
                            {user.firstName}
                        </h6>
                        <Avatar />
                    </div>
                    <div className="groupleaderboard__stats">
                        <h5 className="groupleaderboard__stat1">
                            {getPosition(user)}rd Place
                        </h5>
                        <h5 className="groupleaderboard__stat2">
                            {user.points} points
                        </h5>
                    </div>
                </div>
            </div>
        );
    });

    return (
        <Card className={classes.root}>
            <div className="groupleaderboard__header">
                <h1>{group.groupName}</h1>
            </div>
            {renderPlayers}
            <hr className="groupleaderboard__line" />
        </Card>
    );
};

export default GroupLeaderboard;
