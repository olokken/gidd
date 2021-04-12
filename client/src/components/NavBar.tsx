import { AppBar, Button } from '@material-ui/core';
import React from 'react'; 

const Navbar = () => {

    return(
        <AppBar style={{display:'flex'}}>
            <Button>Hjemmesiden</Button>
            <Button>Kart</Button>
        </AppBar>
    )
}

export default Navbar; 