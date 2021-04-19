import React, {
    ChangeEvent,
    KeyboardEventHandler,
    useEffect,
    useState,
} from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import FriendList from '../components/GroupsAndFriendsComponents/FriendList';



//Endringer kan forekomme her


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }),
);

const GroupsAndFriends = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div style={{width:'20%'}}>
                <FriendList/>
            </div>
        </div>
    );
};

export default GroupsAndFriends;
