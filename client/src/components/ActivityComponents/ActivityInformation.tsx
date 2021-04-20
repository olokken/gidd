import {
    makeStyles,
    createStyles,
    Theme,
    Grid,
    Typography,
    Paper,
    Avatar,
    Card,
    CardContent,
    Tooltip,
    Chip,
    CardMedia,
    Button,
} from '@material-ui/core';
import React from 'react';
import hiking from '../../assets/hiking.jpg';
import map from '../../assets/map.jpg';
import weather from '../../assets/weather.png';
import ActivityResponse from '../../interfaces/ActivityResponse';

interface Props {
    activity: ActivityResponse;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        titlearea: {
            /*margin: `${theme.spacing(1)}px auto`,
        padding: theme.spacing(2),*/
            flex: 1,
            backgroundColor: '#f44336',
            color: 'white',
        },
        publisher: {
            flex: 1,
            backgroundColor: '#f3dbdb',
        },
        joinButton: {
            float: 'right',
            margin: '15px',
            backgroundColor: 'white',
            '&:hover': {
                background: '#ffa6a0',
            },
        },
        supplyList: {
            backgroundColor: 'white',
            marginRight: '10px',
            borderRadius: '10px',
        },
    })
);

const ActivityInformation = ({ activity }: Props) => {
    const classes = useStyles();
    const date = new Date(activity.time);
    const eventTime = new String(date);

    return (
        <div>
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
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item xs={8} style={{ padding: '15px' }}>
                        <Typography gutterBottom variant="h5" component="h3">
                            {activity.title}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Button className={classes.joinButton}>
                            Meld deg på
                        </Button>
                    </Grid>
                </Grid>
            </div>
            <div className={classes.publisher}>
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item style={{ paddingLeft: '15px' }}>
                        <Typography>
                            Aktivitet publisert av: {activity.user['firstName']+ ' ' + activity.user['surname']}
                        </Typography>
                    </Grid>
                </Grid>
            </div>

            <CardContent>
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item>
                        <Typography>
                            <b>Kapasitet:</b>{' '}
                            {activity.registeredParticipants.length} /{' '}
                            {activity.capacity}
                        </Typography>
                        <Typography>
                            <b>Vanskligheitsgrad:</b> {activity.activityLevel}
                        </Typography>
                        <Typography>
                            <b>Tidspunkt: </b>
                            {eventTime}
                        </Typography>
                    </Grid>
                </Grid>
                <Typography style={{ color: 'black' }}>
                    <b>Beskrivelse: </b>
                    <br />
                    {activity.description}
                </Typography>
            </CardContent>
            <br></br>
            <Grid>
                <div className={classes.titlearea}>
                    <Grid item style={{ padding: '15px' }}>
                        <Typography gutterBottom variant="h6" component="h3">
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
            <br />
            <div className={classes.publisher}>
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item xs={4} style={{ padding: '15px' }}>
                        <Typography>Nødvendig utstyr:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <div className={classes.supplyList}>
                            <Chip
                                variant="outlined" // her må man hente utstyr frå det som er registrert og plassere dei inn
                                size="small"
                                label="fotball"
                                style={{
                                    backgroundColor: '#f44336',
                                    borderBlockEndWidth: '0px',
                                    color: 'white',
                                    padding: '10px',
                                    margin: '10px',
                                }}
                            />
                        </div>
                    </Grid>
                </Grid>
            </div>
            <br></br>
            <Grid>
                <div className={classes.titlearea}>
                    <Grid item style={{ padding: '15px' }}>
                        <Typography gutterBottom variant="h6" component="h3">
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
        </div>
    );
};

export default ActivityInformation;