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
import { Edit, Delete } from '@material-ui/icons';
import React, { useContext, useEffect, useState } from 'react';
import { Marker } from 'react-google-maps';
import hiking from '../../assets/hiking.jpg';
import MapComponent from '../MapComponents/MapComponent';
import ActivityResponse from '../../interfaces/ActivityResponse';
import { UserContext } from '../../UserContext';
import Equipment from '../../interfaces/Equipment';
import axios from '../../Axios';
import Popup from '../Popup';
import WeatherComponent from '../WeatherComponents/WeatherComponent';
import ActivityForm from './ActivityForm';

interface Props {
    activity: ActivityResponse;
    openPopup?: boolean;
    setOpenPopup?: React.Dispatch<React.SetStateAction<boolean>>;
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
        otherButton: {
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

const ActivityInformation = ({ activity, openPopup, setOpenPopup }: Props) => {
    const classes = useStyles();
    const date = new Date(activity.time);
    const eventTime = new String(date);
    //Registration is 0 if registration is posible, 1 if you are already registered and 2 if the activity is ful
    const [registration, setRegistration] = useState<number>();
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const { user } = useContext(UserContext);
    const [openEditPopup, setOpenEditPopup] = useState<boolean>(false);

    const editActivity = () => {
        setOpenEditPopup(true);
    };

    const deleteActivity = () => {
        if (setOpenPopup && openPopup) {
            setOpenPopup(!openPopup);
        }
    };

    const register = () => {
        axios
            .post('/user/activity', {
                userId: user,
                activityId: activity.activityId,
            })
            .then((data) => {
                if (data) {
                    setRegistration(1);
                }
            });
    };

    const unRegister = () => {
        axios
            .delete(`/user/${user}/activity/${activity.activityId}`)
            .then(() => setRegistration(0));
    };

    useEffect(() => {
        if (activity.user['userId'] == user) {
            setIsOwner(true);
        }
        if (activity.registeredParticipants.length >= activity.capacity) {
            setRegistration(2);
        } else {
            const registered: number = activity.registeredParticipants
                .map((par) => par.userId['userId'])
                .filter((num) => num == user).length;
            if (registered >= 1) {
                setRegistration(1);
            } else {
                setRegistration(0);
            }
        }
    }, []);

    let registerBtn =
        registration === 2 ? (
            <Button className={classes.joinButton} disabled>
                Aktiviteten er allerede fullbooket
            </Button>
        ) : registration === 1 ? (
            <Button onClick={unRegister} className={classes.joinButton}>
                Meld deg av
            </Button>
        ) : (
            <Button onClick={register} className={classes.joinButton}>
                Meld deg på
            </Button>
        );

    useEffect(() => {
        registerBtn =
            registration === 2 ? (
                <Button className={classes.joinButton} disabled>
                    Aktiviteten er allerede fullbooket
                </Button>
            ) : registration === 1 ? (
                <Button onClick={unRegister} className={classes.joinButton}>
                    Meld deg av
                </Button>
            ) : (
                <Button onClick={register} className={classes.joinButton}>
                    Meld deg på
                </Button>
            );
    }, [registration]);

    const mapEquipments = activity.equipments.map(
        (eq: Equipment, index: number) => {
            return (
                <Chip
                    key={index}
                    variant="outlined"
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

    const mapParticipants = activity.registeredParticipants.map(
        (par: any, index: number) => {
            return (
                <p key={index}>
                    {par.userId['firstName'] + ' ' + par.userId['surname']}
                </p>
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
                    <Grid item xs={7} style={{ padding: '15px' }}>
                        <Typography gutterBottom variant="h5" component="h3">
                            {activity.title}
                        </Typography>
                    </Grid>
                    {isOwner && (
                        <Grid item xs={1}>
                            <Tooltip title="Rediger denne aktiviteten">
                                <Button
                                    onClick={editActivity}
                                    className={classes.otherButton}
                                >
                                    <Edit></Edit>
                                </Button>
                            </Tooltip>
                        </Grid>
                    )}
                    {isOwner && (
                        <Grid item xs={1}>
                            <Tooltip title="Slett denne aktiviteten">
                                <Button
                                    onClick={deleteActivity}
                                    className={classes.otherButton}
                                >
                                    <Delete></Delete>
                                </Button>
                            </Tooltip>
                        </Grid>
                    )}
                    <Grid item xs={3}>
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
                    <Grid item xs={8}>
                        <Grid item>
                            <Typography>
                                <b>Kapasitet:</b>{' '}
                                {activity.registeredParticipants.length} /{' '}
                                {activity.capacity}
                            </Typography>
                            <Typography>
                                <b>Vanskligheitsgrad:</b>{' '}
                                {activity.activityLevel}
                            </Typography>
                            <Typography>
                                <b>Tidspunkt: </b>
                                {eventTime}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={3}>
                        <Typography>
                            <b>Påmeldte personer:</b> {mapParticipants}
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
                        lat={activity.latitude}
                        lon={activity.longitude}
                        time={activity.time}
                    />
                </Grid>
            </Grid>
            <Popup
                openPopup={openEditPopup}
                setOpenPopup={setOpenEditPopup}
                maxWidth="md"
            >
                <ActivityForm
                    activityResponse={activity}
                    openPopup={openEditPopup}
                    setOpenPopup={setOpenEditPopup}
                ></ActivityForm>
            </Popup>
        </div>
    );
};

export default ActivityInformation;
