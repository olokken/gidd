import React from 'react';
import emailjs from 'emailjs-com';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import { Card, CardContent, CardMedia, Typography } from '@material-ui/core';
import logo from '../../assets/logo.png';


const UserProfile = ({friend}: any) => {


  return (
        <Card>
            <CardMedia
                component="img"
                height="140"
                image={logo}
          
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    {friend.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                    across all continents except Antarctica
                </Typography>
            </CardContent>
        </Card>

       
  );
}

export default UserProfile;