import {
    makeStyles,
    createStyles,
    Grid,
    Typography,
    CardContent,
    Tooltip,
    Chip,
    CardMedia,
    Button,
    ListItem,
    ListItemText,
    List,
} from '@material-ui/core';
import { Edit, Delete } from '@material-ui/icons';
import ChatIcon from '@material-ui/icons/Chat';
import React, { useContext, useEffect, useState } from 'react';
import { Marker } from 'react-google-maps';
import hiking from '../../assets/hiking.jpg';
import MapComponent from '../MapComponents/MapComponent';
import ActivityResponse from '../../interfaces/ActivityResponse';
import { UserContext } from '../../UserContext';
import Equipment from '../../interfaces/Equipment';
import Popup from '../Popup';
import WeatherComponent from '../WeatherComponents/WeatherComponent';
import ActivityForm from './ActivityForm';
import Chat from '../ChatComponents/Chat';
import User from '../../interfaces/User';
import PlayerRatingForm from '../Forms/PlayerRatingForm';
import UserAvatar from '../UserAvatar';

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
    const [currentAct] = useState<ActivityResponse>(activity);
    const [currentRegistered] = useState<User[]>(
        activity.registeredParticipants.slice(0, activity.capacity)
    );
    const classes = useStyles();
    const date =
        new Date(activity.time).toLocaleDateString() +
        ' ' +
        new Date(activity.time - 7200000).toLocaleTimeString();
    const [registration, setRegistration] = useState<number>(1);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const { user } = useContext(UserContext);
    const [openEditPopup, setOpenEditPopup] = useState<boolean>(false);
    const [numRegistered, setNumRegistered] = useState<number>(
        activity.registeredParticipants.length
    );
    //const [registeredPart, setRegisteredPart] = useState<
    const [currentParticipant, setCurrentParticipant] = useState<User>({
        firstName: '',
        surname: '',
        userId: '',
        email: '',
        image: '',
        password: '',
        phoneNumber: '',
        activityLevel: '',
        points: '',
    });
    const [openRatingPopup, setRatingPopup] = useState<boolean>(false);

    const onRegisterClick = () => {
        register(activity.activityId).then(() => {
            setRegistration(1);
            setNumRegistered(numRegistered + 1);
        });
    };

    const onWaitingListClick = () => {
        register(activity.activityId).then(() => {
            setRegistration(3);
            setNumRegistered(numRegistered + 1);
        });
    };

    const onUnRegisterClick = () => {
        unRegister(activity.activityId).then(() => {
            setRegistration(0);
            setNumRegistered(numRegistered - 1);
        });
    };

    const removeWaitingList = () => {
        unRegister(activity.activityId).then(() => {
            setRegistration(2);
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

    const showActivityLevel = (actLevel: string) => {
        if (actLevel === 'HIGH') {
            return 'Høy';
        } else if (actLevel === 'MEDIUM') {
            return 'Middels';
        } else if (actLevel === 'LOW') {
            return 'Lav';
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
            if (
                currentRegistered
                    .map((par) => par['userId'])
                    .filter((num) => num == user).length <= 0
            ) {
                setRegistration(3);
            }
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
                <Button
                    onClick={onWaitingListClick}
                    className={classes.joinButton}
                >
                    Fullbooket! <br></br>
                    Meld deg på venteliste
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
        } else if (registration == 3) {
            let myIndex = 0;
            currentAct.registeredParticipants.map((par, index) => {
                if (par['userId'].toString() === user) {
                    myIndex = index + 1;
                }
            });

            return (
                <Button
                    onClick={removeWaitingList}
                    className={classes.joinButton}
                >
                    {'Du er på ' +
                        (myIndex - activity.capacity) +
                        '. plass på vente liste'}
                    <br></br>
                    Meld deg av
                </Button>
            );
        }
    };

    const picture = (): any => {
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

    const mapTags = activity.tags.map(
        (tag: string, index: number) => {
            return (
                <Chip
                    key={index}
                    variant="outlined"
                    size="small"
                    label={tag}
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

    const onParticipantClicked = (par: User) => {
        setCurrentParticipant(par);
        setRatingPopup(!openRatingPopup);
    };

    const mapParticipants = currentRegistered.map((par: any, index: number) => {
        return (
            <ListItem
                button
                key={index}
                onClick={() => {
                    if (user !== par['userId'].toString())
                        onParticipantClicked(par);
                }}
            >
                <UserAvatar
                    user={par}
                    type="small"
                    marginRight="0.5rem"
                ></UserAvatar>
                <ListItemText
                    primary={par['firstName'] + ' ' + par['surname']}
                />
            </ListItem>
        );
    });

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
                        <Button
                            onClick={() => setOpenChat(true)}
                            className={classes.otherButton}
                        >
                            <ChatIcon></ChatIcon>
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
                                {showActivityLevel(activity.activityLevel)}
                            </Typography>
                            <Typography>
                                <b>Tidspunkt: </b>
                                {date}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={3}>
                        <Typography>
                            {registration == 1 && (
                                <>
                                    <b>Påmeldte personer:</b>{' '}
                                    <List
                                        style={{
                                            width: '100%',
                                            float: 'right',
                                            maxHeight: '160px',
                                            overflow: 'auto',
                                        }}
                                    >
                                        {mapParticipants}
                                    </List>
                                </>
                            )}
                        </Typography>
                        <PlayerRatingForm
                            openPopup={openRatingPopup}
                            setOpenPopup={setRatingPopup}
                            user={currentParticipant}
                        ></PlayerRatingForm>
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
            <div className={classes.publisher}>
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item xs={4} style={{ padding: '15px' }}>
                        <Typography>Tags :</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <div className={classes.supplyList}>
                            {mapTags}
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
