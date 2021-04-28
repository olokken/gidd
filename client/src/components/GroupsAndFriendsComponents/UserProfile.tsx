import React, { useContext, useEffect } from 'react';
import emailjs from 'emailjs-com';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import { Button, Card, CardContent, CardMedia, makeStyles, Typography, withStyles } from '@material-ui/core';
import logo from '../../assets/logo.png';
import DeleteIcon from '@material-ui/icons/Delete';
import { UserContext } from '../../UserContext';
import User from '../../interfaces/User';
import axios from '../../Axios'
import styled from 'styled-components';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import verified from '../../assets/verified.png'
import { Rating } from '@material-ui/lab';
import { useState } from 'react';
import UserAvatar from '../../components/UserAvatar'



interface Props {
    updateFriends: () => void;
    friend: User;
    openPopup: boolean;
    setOpenPopup: React.Dispatch<React.SetStateAction<boolean>>;
    friendRating: number | undefined;
}

const showActivityLevel = (actLevel: string) => {
    if (actLevel === 'HIGH') {
        return 'Høy'
    } else if (actLevel === 'MEDIUM') {
        return 'Middels'
    } else if (actLevel === 'LOW') {
        return 'Lav'
    }
}

const UserProfile = ({ friend, openPopup, setOpenPopup, updateFriends, friendRating }: Props) => {
    const { user } = useContext(UserContext);

    const deleteFriend = () => {
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

        < Card >
            { friendRating ?
                <div>
                    <UserAvatar user={friend} type='large'></UserAvatar>
                    <Rating
                        readOnly
                        name="read-onlu"
                        defaultValue={friendRating}
                        precision={0.01}
                        size="large"
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
                            Aktivitetsgrad: {showActivityLevel(friend.activityLevel)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Poeng: {friend.points}
                        </Typography>

                        <div style={{ marginTop: "5px" }}>
                            <Button
                                fullWidth
                                onClick={deleteFriend}
                                variant="contained"
                                color="primary"
                            >  Fjern venn <DeleteIcon style={{ marginLeft: "8px" }} />
                            </Button>
                        </div>
                    </CardContent>
                </div> :
                <div>
                    <UserAvatar user={friend} type='large'></UserAvatar>
                    <Typography gutterBottom variant="h5" component="h2">
                        Ingen rating
                    </Typography>
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
                            Aktivitetsgrad: {showActivityLevel(friend.activityLevel)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Poeng: {friend.points}
                        </Typography>

                        <div style={{ marginTop: "5px" }}>
                            <Button
                                fullWidth
                                onClick={deleteFriend}
                                variant="contained"
                                color="primary"
                            >  Fjern venn <DeleteIcon style={{ marginLeft: "8px" }} />
                            </Button>
                        </div>
                    </CardContent>
                </div>

            }
        </Card >

    );
}

export default UserProfile;
