import {
    AppBar,
    Button,
    Icon,
    Toolbar,
    MenuItem,
    makeStyles,
    ListItem,
    Drawer,
} from '@material-ui/core';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import logo from '../../assets/logo.png';
import ChatIcon from '@material-ui/icons/Chat';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import { withStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import MapIcon from '@material-ui/icons/Map';
import PeopleIcon from '@material-ui/icons/People';
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import Popup from '../Popup';
import MyUser from '../MyUser';
import User from '../../interfaces/User';
import axios from '../../Axios';
import { UserContext } from '../../UserContext';
import CheckIcon from '@material-ui/icons/Check';
import Badge from '@material-ui/core/Badge';

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props: MenuProps) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    /*root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
    },
  },*/
    //kan legges til hvis man vill ha annen bakgrunnsfarge etter klikk
}))(MenuItem);

const Navbar = () => {
    const { user, setUser } = useContext(UserContext);
    const [friendRequests, setFriendRequests] = useState<User[]>([]);
    const [pendingFriendRequests, setPendingFriendRequests] = useState<User[]>(
        []
    );
    const [openUser, setOpenUser] = useState<boolean>(false);
    const [notifications1, setNotifications1] = useState<number>(0);
    const [notifications2, setNotifications2] = useState<number>(0);
    const [state, setState] = useState({
        mobileView: false,
        drawerOpen: false,
    });
    const { mobileView, drawerOpen } = state;
    useEffect(() => {
        const setResponsiveness = () => {
            return window.innerWidth < 951
                ? setState((prevState) => ({ ...prevState, mobileView: true }))
                : setState((prevState) => ({
                      ...prevState,
                      mobileView: false,
                  }));
        };
        setResponsiveness();
        window.addEventListener('resize', () => setResponsiveness());
    }, []);

    //const classes = useStyles();
    const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [
        anchorElProfile,
        setAnchorElProfile,
    ] = React.useState<null | HTMLElement>(null);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleOpenProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElProfile(event.currentTarget);
    };

    const handleCloseProfileMenu = () => {
        setAnchorElProfile(null);
    };

    const changeToMap = () => {
        history.push('/Map');
    };

    const changeToHomePage = () => {
        history.push('/Activities');
    };

    const changeToMyProfile = () => {
        history.push('/MyProfile');
        handleCloseProfileMenu();
    };

    const changeToChat = () => {
        history.push('/Chat');
    };

    const changeToLoginPage = () => {
        localStorage.clear();
        history.push('/');
        handleCloseProfileMenu();
    };

    const changeToLeaderboard = () => {
        history.push('/Leaderboard');
    };

    const changeToCalender = () => {
        history.push('/Calendar');
    };

    const changeToGroupsAndFriends = () => {
        history.push('/GroupsAndFriends');
    };
    //henter alle pending *angre
    const loadPending = () => {
        axios
            .get(`/user/${localStorage.getItem('userID')}/pending`)
            .then((response) => {
                console.log('PendingVenneforespørsler:');
                console.log(response.data['users']);
                setPendingFriendRequests(response.data['users']);
            })
            .catch((error) => console.log(error));
    };
    const loadRequest = () => {
        //henter alle reqest ja/nei
        console.log(localStorage.getItem('userID'));
        axios
            .get(`/user/${localStorage.getItem('userID')}/request`)
            .then((response) => {
                console.log('Venneforespørsler:');
                console.log(response.data['users']);
                setFriendRequests(response.data['users']);
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        loadRequest();
    }, [user]);

    //henter alle sendte venneforespørsler
    useEffect(() => {
        loadPending();
    }, [user]);

    /* const setNotificationData = () => {
        setTimeout(()=>{
            setNotifications(friendRequests.length + pendingFriendRequests.length)
            console.log('notdata: ' + (friendRequests.length + pendingFriendRequests.length) );
            if(notifications > 0){
                setInvisible(false)
            }else{setInvisible(true)}
        },5000);
    }*/

    const declineRequest = (request: User) => {
        deleteFriend(Object.values(request)[0]);
    };

    const addFriend = (request: User) => {
        postFriend(Object.values(request)[0]);
    };
    //godkjenner forespørsel
    const postFriend = (friendId: string) => {
        console.log(friendId);
        axios
            .post(`/user/${localStorage.getItem('userID')}/user`, {
                userId: localStorage.getItem('userID'),
                friendId: friendId,
            })
            .then((response) => {
                JSON.stringify(response);
                console.log(response.data);
            })
            .then(() => {
                loadPending();
                loadRequest();
            })
            .catch((error) => {
                console.log('Could not post friend: ' + error.message);
                alert('Du er allerede venn med denne brukeren');
            });
    };
    //sletter forespørsel
    const deleteFriend = (friendId: string) => {
        axios
            .delete(`user/${user}/user/${friendId}`)
            .then((response) => {
                JSON.stringify(response);
                console.log(response.data);
            })
            .then(() => {
                loadPending();
                loadRequest();
            })
            .catch((error) =>
                console.log('Could not delete friend: ' + error.message)
            );
    };

    const getDefault = () => {
        if (friendRequests.length < 1 && pendingFriendRequests.length < 1) {
            return (
                <StyledMenuItem
                    style={{
                        whiteSpace: 'normal',
                        display: 'block',
                        textAlign: 'center',
                        width: '300px',
                        fontSize: '15px',
                    }}
                    onClick={handleCloseMenu}
                >
                    <b style={{ marginTop: '50px', paddingTop: '100px' }}>
                        Du har ingen varsler
                    </b>
                </StyledMenuItem>
            );
        }
    };

    const displayMobile = () => {
        const getDrawerChoices = () => {
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    <br />
                    <Button
                        style={{ padding: '10px' }}
                        onClick={changeToHomePage}
                    >
                        <DirectionsRunIcon />
                        Aktiviteter
                    </Button>
                    <Button style={{ padding: '10px' }} onClick={changeToMap}>
                        <MapIcon />
                        Kart
                    </Button>
                    <Button
                        style={{ padding: '10px' }}
                        onClick={changeToCalender}
                    >
                        {' '}
                        <CalendarTodayIcon /> Kalender
                    </Button>
                    <Button
                        style={{ padding: '10px' }}
                        onClick={changeToGroupsAndFriends}
                    >
                        <PeopleIcon />
                        Grupper og venner
                    </Button>
                    <Button
                        style={{ padding: '10px' }}
                        onClick={changeToLeaderboard}
                    >
                        <EmojiEventsIcon />
                        Leaderboard
                    </Button>
                    <Button
                        style={{ padding: '10px' }}
                        onClick={() => setOpenUser(!openUser)}
                    >
                        <AccountBoxIcon />
                        Min bruker
                    </Button>
                    <Popup
                        title="Min Bruker"
                        openPopup={openUser}
                        setOpenPopup={setOpenUser}
                    >
                        <MyUser
                            openPopup={openUser}
                            setOpenPopup={setOpenUser}
                        />
                    </Popup>
                    <Button
                        style={{ padding: '10px' }}
                        onClick={changeToLoginPage}
                    >
                        <ExitToAppIcon />
                        Logg ut
                    </Button>
                </div>
            );
        };

        const handleDrawerOpen = () =>
            setState((prevState) => ({ ...prevState, drawerOpen: true }));

        const handleDrawerClose = () =>
            setState((prevState) => ({ ...prevState, drawerOpen: false }));
        return (
            <Toolbar
                style={{ display: 'flex', justifyContent: 'space-between' }}
            >
                <img
                    onClick={changeToHomePage}
                    src={logo}
                    style={{
                        width: '50px',
                        margin: '3px',
                        cursor: 'pointer',
                    }}
                />
                <div>
                    <IconButton onClick={changeToChat}>
                        <ChatIcon />
                    </IconButton>
                    <IconButton
                        aria-controls="dropdownNotifications"
                        aria-haspopup="true"
                        onClick={handleOpenMenu}
                    >
                        <Badge
                            badgeContent={
                                pendingFriendRequests.length +
                                friendRequests.length
                            }
                            color="primary"
                        >
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                </div>
                <IconButton onClick={handleDrawerOpen}>
                    <MenuIcon />
                </IconButton>
                <Drawer
                    //variant="persistent"
                    {...{
                        anchor: 'right',
                        open: drawerOpen,
                        onClose: handleDrawerClose,
                    }}
                >
                    <br />
                    <IconButton
                        style={{
                            position: 'absolute',
                            top: '5px',
                            right: '0',
                        }}
                        onClick={handleDrawerClose}
                    >
                        <CloseIcon />
                    </IconButton>
                    <b style={{ textAlign: 'center' }}>Meny</b>
                    <Divider
                        style={{
                            marginTop: '20px',
                        }}
                    />
                    <div style={{ padding: '10px' }}>{getDrawerChoices()}</div>
                </Drawer>
            </Toolbar>
        );
    };
    const displayDesktop = () => {
        return (
            <Toolbar
                style={{ display: 'flex', justifyContent: 'space-between' }}
            >
                <img
                    onClick={changeToHomePage}
                    src={logo}
                    style={{
                        width: '50px',
                        margin: '3px',
                        cursor: 'pointer',
                    }}
                />
                <Button onClick={changeToHomePage}>
                    {' '}
                    <DirectionsRunIcon />
                    Aktiviteter
                </Button>
                <Button onClick={changeToMap}>
                    <MapIcon />
                    Kart
                </Button>
                <Button onClick={changeToCalender}>
                    {' '}
                    <CalendarTodayIcon />
                    Kalender
                </Button>
                <Button onClick={changeToGroupsAndFriends}>
                    <PeopleIcon />
                    Grupper og venner
                </Button>
                <Button onClick={changeToLeaderboard}>
                    <EmojiEventsIcon />
                    Leaderboard
                </Button>
                <div>
                    <IconButton onClick={changeToChat}>
                        <ChatIcon />
                    </IconButton>
                    <IconButton
                        aria-controls="dropdownNotifications"
                        aria-haspopup="true"
                        onClick={handleOpenMenu}
                    >
                        <Badge
                            badgeContent={
                                friendRequests.length +
                                pendingFriendRequests.length
                            }
                            color="primary"
                        >
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <IconButton
                        aria-controls="dropdownProfile"
                        aria-haspopup="true"
                        onClick={handleOpenProfileMenu}
                    >
                        <AccountBoxIcon />
                    </IconButton>
                </div>
            </Toolbar>
        );
    };

    return (
        <div>
            <AppBar position="static" style={{ display: 'flex' }}>
                {mobileView ? displayMobile() : displayDesktop()}
            </AppBar>

            <StyledMenu
                id="dropdownNotifications"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
            >
                {getDefault()}

                {friendRequests.map((request: User) => {
                    return (
                        <StyledMenuItem
                            style={{
                                whiteSpace: 'normal',
                                display: 'block',
                                textAlign: 'center',
                                width: '300px',
                                fontSize: '15px',
                            }}
                            key={request.userID}
                            onClick={handleCloseMenu}
                        >
                            <div>
                                <b>Venneforespørsel fra:</b>
                                <p style={{ marginTop: '2px' }}>
                                    {request.firstName + ' ' + request.surname}
                                </p>
                                <IconButton
                                    style={{
                                        color: 'green',
                                        marginTop: '-15px',
                                    }}
                                >
                                    <CheckIcon
                                        onClick={() => addFriend(request)}
                                    />
                                </IconButton>
                                <IconButton
                                    style={{ color: 'red', marginTop: '-15px' }}
                                >
                                    <CloseIcon
                                        onClick={() => declineRequest(request)}
                                    />
                                </IconButton>
                            </div>
                            <hr />
                        </StyledMenuItem>
                    );
                })}

                {pendingFriendRequests.map((pending: User) => {
                    return (
                        <StyledMenuItem
                            style={{
                                whiteSpace: 'normal',
                                display: 'block',
                                textAlign: 'center',
                                width: '300px',
                                fontSize: '15px',
                            }}
                            key={pending.userID}
                            onClick={handleCloseMenu}
                        >
                            <div>
                                <b>Du har sendt en venneforspørsel til:</b>
                                <p style={{ marginTop: '-5px' }}>
                                    {pending.firstName + ' ' + pending.surname}
                                    <IconButton style={{ color: 'red' }}>
                                        <CloseIcon
                                            onClick={() =>
                                                declineRequest(pending)
                                            }
                                        />
                                    </IconButton>
                                </p>
                            </div>
                            <hr />
                        </StyledMenuItem>
                    );
                })}
            </StyledMenu>

            <StyledMenu
                id="dropdownProfile"
                anchorEl={anchorElProfile}
                keepMounted
                open={Boolean(anchorElProfile)}
                onClose={handleCloseProfileMenu}
            >
                <StyledMenuItem onClick={() => setOpenUser(!openUser)}>
                    <ListItemIcon>
                        <AccountBoxIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Min bruker" />
                </StyledMenuItem>
                <Popup
                    title="Min Bruker"
                    openPopup={openUser}
                    setOpenPopup={setOpenUser}
                >
                    <MyUser openPopup={openUser} setOpenPopup={setOpenUser} />
                </Popup>
                <StyledMenuItem onClick={changeToLoginPage}>
                    <ListItemIcon>
                        <ExitToAppIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Logg ut" />
                </StyledMenuItem>
            </StyledMenu>
        </div>
    );
};

export default Navbar;
