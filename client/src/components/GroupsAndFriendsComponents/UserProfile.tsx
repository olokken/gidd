import React, { useContext } from 'react';
import emailjs from 'emailjs-com';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import { Button, Card, CardContent, CardMedia, Typography } from '@material-ui/core';
import logo from '../../assets/logo.png';
import ChatIcon from '@material-ui/icons/Chat';
import { UserContext } from '../../UserContext';
import { User2 } from '../../interfaces/User';


const UserProfile = ({friend}: any) => {
    const {user, setUser} = useContext(UserContext);

    const deleteFriend = () =>{
        console.log(Object.values(friend)[0])
        console.log(user)
    }


  return (
        <Card>
            <CardMedia
                component="img"
                height="140"
                image={logo}
          
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    {friend.firstName + ' ' + friend.surname}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    Epost: {friend.email}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    Tlf: {friend.phoneNumber}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    Aktivitetsgrad: {friend.activityLevel}
                </Typography>
                <div style={{marginTop: "5px"}}>
                    <Button style={{marginRight: "5px"}}  
                        onClick={deleteFriend} 
                        variant="contained" 
                        color="primary"
                    >  Fjern venn
                    </Button>
                    <Button   
                        variant="contained" 
                        color="primary"
                        >Chat <ChatIcon style={{ marginLeft: '8px'}}/>
                    </Button>
                </div>
            </CardContent>
        </Card>

       
  );
}

export default UserProfile;