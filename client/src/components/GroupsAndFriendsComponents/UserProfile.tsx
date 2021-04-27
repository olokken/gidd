import React, { useContext } from 'react';
import emailjs from 'emailjs-com';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import { Button, Card, CardContent, CardMedia, Typography } from '@material-ui/core';
import logo from '../../assets/logo.png';
import DeleteIcon from '@material-ui/icons/Delete';
import { UserContext } from '../../UserContext';
import User from '../../interfaces/User';
import axios from '../../Axios'

interface Props {
    updateFriends: () => void;
    friend: User;
    openPopup: boolean;
    setOpenPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserProfile = ({friend, openPopup, setOpenPopup, updateFriends}: Props) => {
    const {user, setUser} = useContext(UserContext);

    const deleteFriend = () =>{
        deleteAxFriend(Object.values(friend)[0]);
        setOpenPopup(!openPopup);
    }

    const deleteAxFriend = (friendId: string) => {
        axios
            .delete(`user/${user}/user/${friendId}`) 
            .then((response) => {
                JSON.stringify(response);
                console.log(response.data);
            }).then(updateFriends)
            .catch((error) =>
                console.log('Could not delete friend: ' + error.message)
            );
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
                <Typography variant="body2" color="textSecondary" component="p">
                    Poeng: {friend.points}
                </Typography>
                <div style={{marginTop: "5px"}}>
                    <Button 
                        fullWidth
                        onClick={deleteFriend} 
                        variant="contained" 
                        color="primary"
                    >  Fjern venn <DeleteIcon style={{marginLeft:"8px"}}/>
                    </Button>
                </div>
            </CardContent>
        </Card>
  );
}

export default UserProfile;