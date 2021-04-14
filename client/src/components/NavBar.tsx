import { AppBar, Button, Icon, Toolbar, MenuItem, makeStyles, ListItem } from '@material-ui/core';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import React, {useState} from 'react'; 
import { useHistory } from 'react-router-dom';
import logo from '../assets/logo.png';
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

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
    //width:"300px",
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
  },*/ //kan legges til hvis man vill ha annen bakgrunnsfarge etter klikk
}))(MenuItem);



const Navbar = () => {
    const history = useHistory(); 
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [anchorElProfile, setAnchorElProfile] = React.useState<null | HTMLElement>(null);

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
    }

    const changeToHomePage = () => {
        history.push('/Activities');
    }

    const changeToMyProfile = () => {
        history.push('/MyProfile');
    }

    const changeToChat = () => {
        history.push('/Chat');
    }

    const changeToLoginPage = () => {
        history.push('/');
    }

    const changeToSettings = () => {
        history.push('/Settings');
    }

    return(
        <div>
        <AppBar position="static" style={{display:'flex'}}>
            <Toolbar style={{display:"flex", justifyContent:"space-between"}}>
                <img onClick={changeToHomePage} src={logo}
                    style={{
                        width:"60px", 
                        margin:"3px",
                        cursor:"pointer"
                    }} />
                <Button onClick={changeToHomePage}>Aktiviteter</Button>
                <Button onClick={changeToMap}>Kart</Button>
                <Button>Kalender</Button>
                <Button>Grupper og venner</Button>
                <Button>Leaderboard</Button>
                <div>
                    <IconButton onClick={changeToChat}>
                       <ChatIcon/>
                    </IconButton>
                    <IconButton aria-controls="dropdownNotifications" aria-haspopup="true" 
                        onClick={handleOpenMenu}>
                        <NotificationsIcon/>
                    </IconButton>
                    <IconButton aria-controls="dropdownProfile" aria-haspopup="true" 
                    onClick={handleOpenProfileMenu}>   
                        <AccountBoxIcon/>
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
        <StyledMenu
        id="dropdownNotifications"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <StyledMenuItem>
            <div style={{whiteSpace: 'normal',display: 'block'}}>
                <p>Du har en ny beskjed!</p> 
                <b>Dataingeniør</b>
            </div>
        </StyledMenuItem>
        <StyledMenuItem>
          <div style={{whiteSpace: 'normal',display: 'block'}}>
                <p>Du har en ny beskjed!</p> 
                <b>Dataingeniør</b>
            </div>
        </StyledMenuItem>
        <StyledMenuItem>
          <div style={{whiteSpace: 'normal',display: 'block'}}>
                <p>Du har en ny beskjed!</p> 
                <b>Dataingeniør</b>
            </div>
        </StyledMenuItem>
      </StyledMenu>

      <StyledMenu
        id="dropdownProfile"
        anchorEl={anchorElProfile}
        keepMounted
        open={Boolean(anchorElProfile)}
        onClose={handleCloseProfileMenu}
      >
        <StyledMenuItem onClick={changeToMyProfile}>
            <ListItemIcon>
                <AccountBoxIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Min bruker" />
        </StyledMenuItem>
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

    )
}

export default Navbar; 


