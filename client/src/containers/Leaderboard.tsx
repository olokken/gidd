import React, {
    ChangeEvent,
    KeyboardEventHandler,
    useEffect,
    useState,
} from 'react';
import ActivityForm from '../components/ActivityComponents/ActivityForm';
import styled from 'styled-components';
import SideFilter from '../components/FilterComponents/SideFilter';
import SortMenu from '../components/SortingComponents/SortMenu';
import Activity, { ActivityList } from '../interfaces/Activity';
import ActivityGrid from '../components/ActivityComponents/ActivityGrid';
import Popup from '../components/Popup'
import AddButton from '../components/ActivityComponents/AddButton'; 
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

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

const Leaderboard = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Paper className={classes.paper}>xs=6</Paper>
        </Grid>
        <Grid item xs={9}>
          <Grid item xs={12}>
          <Paper className={classes.paper}>xs=12</Paper>
        </Grid>
          
          <Grid item xs={12}>
          <Paper className={classes.paper}>xs=12</Paper>
        </Grid>
        </Grid>
        
        
      </Grid>
    </div>
    );
};

export default Leaderboard;
