import { makeStyles, createStyles, Theme, Grid, Typography, Paper, Avatar, Card, CardContent, Tooltip, Chip, CardMedia, Button } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import Activity from '../../interfaces/Activity';
import hiking from '../../assets/hiking.jpg';
import map from '../../assets/map.jpg';
import weather from '../../assets/weather.png';

interface Props {
    activity: Activity;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titlearea: {
        /*margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),*/
        backgroundColor: 'black',
        color: 'white',
      },
    publisher: {
        backgroundColor: 'lightgray'
        },
    joinButton:{
        float: 'right',
        margin: '4px',
        backgroundColor: 'white',
        '&:hover': {
            background: 'gray',
         },
    }
  }),
);


const ActivityInformation = ({ activity }: Props) => {
    const classes = useStyles();
    return (
    <div
    >       
            <Grid>
                <Grid item>
                    <CardMedia
                        component="img"
                        alt={'Image related to the activity' + activity.title}
                        height="200"
                        image={hiking} // her skal bildet egentlig hentast for aktiviteta
                    />
                </Grid>
            </Grid>
            <div className={classes.titlearea}>
                    <Grid item 
                        style={{padding: '15px'}}>
                        <Typography
                            gutterBottom
                            variant="h5"
                            component="h3"
                        >
                            {activity.title}
                        <Button className={classes.joinButton}>Meld deg på</Button>
                        </Typography>
                    </Grid>
            </div>
            <div className={classes.publisher}>
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item
                        style={{paddingLeft: '15px'}}>
                        <Typography>Aktivitet publisert av: {activity.owner}</Typography>
                    </Grid>
                </Grid>
            </div>

            <CardContent>
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item>
                        <Typography><b>Kapasitet:</b> {activity.capacity} / {activity.maxCapacity}</Typography>
                        <Typography><b>Vanskligheitsgrad:</b> {activity.level}</Typography>
                    </Grid>
                </Grid>
                <Typography
                    style={{ color: 'black' }}
                >
                    <b>Beskrivelse: </b>
                    <br/>
                    {activity.description}
                </Typography>
            </CardContent>
            <br></br>
                <Grid>
                <div className={classes.titlearea}>
                    <Grid item 
                        style={{padding: '15px'}}>
                        <Typography
                            gutterBottom
                            variant="h6"
                            component="h3"
                        >
                            Lokasjon:
                        </Typography>
                    </Grid>
                </div>
                    <Grid item>
                        <CardMedia
                            component="img"
                            alt={'Map'}
                            height="200"
                            image={map}
                        />
                    </Grid>
                </Grid>
                <br></br>
                <Grid>
                <div className={classes.titlearea}>
                    <Grid item 
                        style={{padding: '15px'}}>
                        <Typography
                            gutterBottom
                            variant="h6"
                            component="h3"
                        >
                            Værmelding:
                        </Typography>
                    </Grid>
                </div>
                    <Grid item>
                        <CardMedia
                            component="img"
                            alt={'Weather forecast'}
                            height="200"
                            image={weather}
                        />
                    </Grid>
                </Grid>
                <div className={classes.titlearea}>
                    <Grid item 
                        style={{padding: '15px'}}>
                        <Typography
                            gutterBottom
                            variant="h6"
                            component="h3"
                        >
                            Nødvendig utstyr:
                        </Typography>
                    </Grid>
                </div>
                    <Grid item>
                    <Chip
                                variant="outlined" // her må man hente utstyr frå det som er registrert og plassere dei inn
                                size="small"
                                label='fotball'
                                style={{
                                    backgroundColor: 'black',
                                    borderBlockEndWidth: '0px',
                                    color: 'white',
                                }}
                            />
                    </Grid>
    </div>
    );
};

export default ActivityInformation;
