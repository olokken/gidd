import {
    makeStyles,
    createStyles,
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
import Chat from '../ChatComponents/Chat';

interface Props {
    activity: ActivityResponse;
    openPopup?: boolean;
    setOpenPopup?: React.Dispatch<React.SetStateAction<boolean>>;
    deleteActivity?: (id: number) => void;
    register: (id: number) => Promise<void>;
    unRegister: (id: number) => Promise<void>;
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

const ActivityInformation = ({
    activity,
    deleteActivity,
    setOpenPopup,
    openPopup,
    register,
    unRegister,
}: Props) => {
    const [openChat, setOpenChat] = useState<boolean>(false);
    const [currentAct, setCurrentAct] = useState<ActivityResponse>(activity);
    const classes = useStyles();
    const date = new Date(activity.time);
    const eventTime = new String(date);
    //Registration is 0 if registration is posible, 1 if you are already registered and 2 if the activity is ful
    const [registration, setRegistration] = useState<number>(1);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const { user } = useContext(UserContext);
    const [openEditPopup, setOpenEditPopup] = useState<boolean>(false);
    const [numRegistered, setNumRegistered] = useState<number>(
        activity.registeredParticipants.length
    );

    const onRegisterClick = () => {
        register(activity.activityId).then(() => {
            setRegistration(1);
            setNumRegistered(numRegistered + 1);
        });
    };

    const onUnRegisterClick = () => {
        unRegister(activity.activityId).then(() => {
            setRegistration(0);
            setNumRegistered(numRegistered - 1);
        });
    };

    const editActivity = () => {
        setOpenEditPopup(true);
    };

    const onDeleteClick = () => {
        if (deleteActivity && openPopup && setOpenPopup) {
            deleteActivity(activity.activityId);
            setOpenPopup(!openPopup);
        }
    };

    useEffect(() => {
        let value = -1;
        if (activity.user['userId'] == user) {
            setIsOwner(true);
        }
        const registered: number = currentAct.registeredParticipants
            .map((par) => par['userId'])
            .filter((num) => num == user).length;
        if (registered >= 1) {
            value = 1;
            setRegistration(1);
        } else if (
            currentAct.registeredParticipants.length >= currentAct.capacity &&
            value != 1
        ) {
            setRegistration(2);
        } else {
            setRegistration(0);
        }
    }, []);

    const registerBtn = () => {
        if (registration == 1) {
            return (
                <Button
                    onClick={onUnRegisterClick}
                    className={classes.joinButton}
                >
                    Meld deg av
                </Button>
            );
        } else if (registration == 2) {
            return (
                <Button className={classes.joinButton} disabled>
                    Aktiviteten er allerede fullbooket
                </Button>
            );
        } else if (registration == 0) {
            return (
                <Button
                    onClick={onRegisterClick}
                    className={classes.joinButton}
                >
                    Meld deg på
                </Button>
            );
        }
    };

    const picture = () : any => {
        if (activity.image.length > 40) {
            return activity.image; 
        }
            return hiking; 
    }; 

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

    const mapParticipants = currentAct.registeredParticipants.map(
        (par: any, index: number) => {
            return <p key={index}>{par['firstName'] + ' ' + par['surname']}</p>;
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
                        image={picture()} // her skal bildet egentlig hentast for aktiviteta
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
                                    onClick={onDeleteClick}
                                    className={classes.otherButton}
                                >
                                    <Delete></Delete>
                                </Button>
                            </Tooltip>
                        </Grid>
                    )}
                    <Grid item xs={3}>
                        {!isOwner && registerBtn()}
                    </Grid>
                    {registration == 1 && (
                        <Button onClick={() => setOpenChat(true)}>
                            Åpen chat
                        </Button>
                    )}
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
                                <b>Kapasitet:</b> {numRegistered} /{' '}
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
                            {registration == 1 && (
                                <>
                                    <b>Påmeldte personer:</b> {mapParticipants}
                                </>
                            )}
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
            <Chat
                activityId={activity.activityId}
                open={openChat}
                close={() => setOpenChat(false)}
            ></Chat>
        </div>
    );
};

export default ActivityInformation;
