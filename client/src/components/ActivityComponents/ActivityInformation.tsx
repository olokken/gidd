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
import React, { useContext, useEffect, useState } from 'react';
import { Marker } from 'react-google-maps';
import hiking from '../../assets/hiking.jpg';
import MapComponent from '../MapComponents/MapComponent';
import weather from '../../assets/weather.png';
import ActivityResponse from '../../interfaces/ActivityResponse';
import { UserContext } from '../../UserContext';
import Equipment from '../../interfaces/Equipment';
import MapMarker from '../MapComponents/MapMarker';
import WeatherComponent from '../WeatherComponents/WeatherComponent';

interface Props {
    activity: ActivityResponse;
}
const useStyles = makeStyles(() =>
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
    const lat = 63.430515;
    const lon = 10.395053;
    const classes = useStyles();
    const date = new Date(activity.time);
    const eventTime = new String(date);
    const [isRegistered, setIsRegistered] = useState<boolean>(true);
    const { user } = useContext(UserContext);

    const register = () => {
        console.log('Registrer bruker til aktivitet');
    };

    const unRegister = () => {
        console.log('Avregistrer bruker til aktivitet');
    };

    useEffect(() => {
        const registered: number[] = activity.registeredParticipants.map(
            (u) => u.userID
        );
        if (registered.includes(user)) setIsRegistered(true);
        else setIsRegistered(false);
    }, []);

    const registerBtn = isRegistered ? (
        <Button onClick={unRegister} className={classes.joinButton}>
            Meld deg av
        </Button>
    ) : (
        <Button onClick={register} className={classes.joinButton}>
            Meld deg på
        </Button>
    );

    const mapEquipments = activity.equipments.map(
        (eq: Equipment, index: number) => {
            return (
                <Chip
                    key={index}
                    variant="outlined" // her må man hente utstyr frå det som er registrert og plassere dei inn
                    size="small"
                    label={eq.description}
                    style={{
                        backgroundColor: '#f44336',
                        borderBlockEndWidth: '0px',
                        color: 'white',
                        padding: '10px',
                        margin: '10px',
                    }}
                />
            );
        }
    );

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
                        {registerBtn}
                    </Grid>
                </Grid>
            </div>
            <div className={classes.publisher}>
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item style={{ paddingLeft: '15px' }}>
                        <Typography>
                            Aktivitet publisert av:{' '}
                            {activity.user['firstName'] +
                                ' ' +
                                activity.user['surname']}
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
                    <MapComponent
                        defaultCenter={{
                            lat: activity.latitude,
                            lng: activity.longitude,
                        }}
                        width="100%"
                        height="30rem"
                    >
                        <Marker
                            position={{
                                lat: activity.latitude,
                                lng: activity.longitude,
                            }}
                        ></Marker>
                    </MapComponent>
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
                            {mapEquipments}
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
                        <WeatherComponent 
                            lat={lat}//lat og lon må korrespondere med informasjonen om lokasjonen til økta
                            lon={lon}
                            time={activity.time}
                        />
                    </Grid>
            </Grid>
        </div>
    );
}

export default ActivityInformation;