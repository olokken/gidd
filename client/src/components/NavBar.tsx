import { AppBar, Button, Icon, Toolbar, Menu, MenuItem } from '@material-ui/core';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import React, {MouseEvent, useState, } from 'react'; 
import { useHistory } from 'react-router-dom';
import logo from '../assets/logo.png';
import ChatIcon from '@material-ui/icons/Chat';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountBoxIcon from '@material-ui/icons/AccountBox';

const StyledNotificationMenu = styled.div`
    
`;


const Navbar = () => {
    const history = useHistory(); 
    const [anchorEl, setAnchorEl] = useState(null);

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

    const handleOpenMenu = (e:any) => {
        setAnchorEl(e.currentTarget);
    }

    const handleCloseMenu = (e:any) => {
        setAnchorEl(null)
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
                    <IconButton onClick={changeToMyProfile}>   
                        <AccountBoxIcon/>
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
        <Menu
            id="dropdownNotifications"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
        >
            <MenuItem onClick={handleCloseMenu}>Profile</MenuItem>
            <MenuItem onClick={handleCloseMenu}>My account</MenuItem>
            <MenuItem onClick={handleCloseMenu}>Logout</MenuItem>
        </Menu>
    </div>

    )
}

export default Navbar; 


