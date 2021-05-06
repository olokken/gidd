import User from '../interfaces/User';
import verified from '../assets/verified.png';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import styled from 'styled-components';
import { makeStyles, withStyles } from '@material-ui/core';
import React from 'react';

interface Props {
    user: User;
    type: string;
    marginRight?: string;
}

const AvatarDiv = styled.div`
    justify-content: center;
    display: flex;
    margin-left: 10px;
`;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    small: {
        width: 50,
        height: 50,
    },
    large: {
        width: 300,
        height: 300,
    },
    mini: {
        width: 20,
        height: 20,
    },
}));

const SmallAvatar = withStyles((theme) => ({
    root: {
        border: `2px solid ${theme.palette.background.paper}`,
    },
}))(Avatar);

const UserAvatar = ({ user, type, marginRight }: Props) => {
    const classes = useStyles();
    return (
        <AvatarDiv
            style={{ marginRight: marginRight === '' ? '0' : marginRight }}
        >
            {+user.points >= 1000 ? (
                <Badge
                    overlap="circle"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    badgeContent={
                        <SmallAvatar
                            alt="Remy Sharp"
                            src={verified}
                            className={
                                type == 'small' ? classes.mini : classes.small
                            }
                        />
                    }
                >
                    <Avatar
                        src={user.image}
                        className={
                            type == 'small' ? classes.small : classes.large
                        }
                    />
                </Badge>
            ) : (
                <Avatar
                    src={user.image}
                    className={type == 'small' ? classes.small : classes.large}
                />
            )}
        </AvatarDiv>
    );
};

export default UserAvatar;
