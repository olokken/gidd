import { AppBar, Button } from '@material-ui/core';
import React from 'react'; 
import { useHistory } from 'react-router';

const Navbar = () => {
    const history = useHistory(); 

    const changeToMap = () => {
        history.push('/Map');
    }

    const changeToHomePage = () => {
        history.push('/HomePage');
    }

    return(
        <AppBar style={{display:'flex'}}>
            <Button onClick={changeToHomePage}>Hjemmesiden</Button>
            <Button onClick={changeToMap}>Kart</Button>
        </AppBar>
    )
}

export default Navbar; 