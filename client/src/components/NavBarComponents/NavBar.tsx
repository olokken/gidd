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
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import logo from '../../assets/logo.png';
import ChatIcon from '@material-ui/icons/Chat';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import { withStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import SettingsIcon from '@material-ui/icons/Settings';
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
    const [openUser, setOpenUser] = useState<boolean>(false);
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

    const onClickAnnouncements = (hvor: string) => {
        handleCloseMenu();
        history.push('/' + hvor);
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
        history.push('/');
        handleCloseProfileMenu();
    };

    const changeToSettings = () => {
        history.push('/Settings');
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

    const notifications = [
        {
            description: 'Det er tid for tur igjen. Være klar 18.00',
            title: 'Tur til fjellet',
        },
        {
            description: 'gøttaa',
            title: 'asdasdds',
        },
        {
            description: 'gøttaa',
            title: 'asdasdds',
        },
    ];

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
                        onClick={changeToHomePageDrawer}
                    >
                        <DirectionsRunIcon />
                        Aktiviteter
                    </Button>
                    <Button
                        style={{ padding: '10px' }}
                        onClick={changeToMapDrawer}
                    >
                        <MapIcon />
                        Kart
                    </Button>
                    <Button
                        style={{ padding: '10px' }}
                        onClick={changeToCalenderDrawer}
                    >
                        {' '}
                        <CalendarTodayIcon /> Kalender
                    </Button>
                    <Button
                        style={{ padding: '10px' }}
                        onClick={changeToGroupsAndFriendsDrawer}
                    >
                        <PeopleIcon />
                        Grupper og venner
                    </Button>
                    <Button
                        style={{ padding: '10px' }}
                        onClick={changeToLeaderboardDrawer}
                    >
                        <EmojiEventsIcon />
                        Leaderboard
                    </Button>
                </div>
            );
        };

        const changeToLeaderboardDrawer = () => {
            history.push('/Leaderboard');
            handleDrawerClose();
        };

        const changeToCalenderDrawer = () => {
            history.push('/Calendar');
            handleDrawerClose();
        };

        const changeToGroupsAndFriendsDrawer = () => {
            history.push('/GroupsAndFriends');
            handleDrawerClose();
        };
        const changeToHomePageDrawer = () => {
            history.push('/Activities');
            handleDrawerClose();
        };
        const changeToMapDrawer = () => {
            history.push('/Map');
            handleDrawerClose();
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
                        <NotificationsIcon />
                    </IconButton>
                    <IconButton
                        aria-controls="dropdownProfile"
                        aria-haspopup="true"
                        onClick={handleOpenProfileMenu}
                    >
                        <AccountBoxIcon />
                    </IconButton>
                </div>
                <IconButton onClick={handleDrawerOpen}>
                    <MenuIcon />
                </IconButton>
                <Drawer
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
                        <NotificationsIcon />
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
                {notifications.map((notification, index) => {
                    return (
                        <StyledMenuItem
                            style={{
                                whiteSpace: 'normal',
                                display: 'block',
                                textAlign: 'center',
                                width: '300px',
                                fontSize: '15px',
                            }}
                            key={index}
                            onClick={handleCloseMenu}
                        >
                            <div>
                                <b>{notification.title}</b>
                                <p>{notification.description}</p>
                                <p
                                    style={{
                                        position: 'relative',
                                        bottom: '0',
                                        right: '0',
                                        color: 'grey',
                                        opacity: '50%',
                                    }}
                                >
                                    Mandag 12.04.2012 kl 20.00
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
                    <MyUser />
                </Popup>
                <StyledMenuItem onClick={changeToSettings}>
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Innstillinger" />
                </StyledMenuItem>
                <StyledMenuItem onClick={changeToLoginPage}>
                    <ListItemIcon>
                        <ExitToAppIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Log ut" />
                </StyledMenuItem>
            </StyledMenu>
        </div>
    );
};

export default Navbar;
