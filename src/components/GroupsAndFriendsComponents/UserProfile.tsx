import React, { useContext } from 'react';

import { Button, Card, CardContent, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { UserContext } from '../../UserContext';
import User from '../../interfaces/User';
import axios from '../../Axios';
import { Rating } from '@material-ui/lab';
import UserAvatar from '../../components/UserAvatar'
import config from '../../Config';



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
    };



    const deleteAxFriend = (friendId: string) => {
        axios
            .delete(`user/${user}/user/${friendId}`, config)
            .then((response) => {
                JSON.stringify(response);
                console.log(response.data);
            })
            .then(updateFriends)
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
};

export default UserProfile;
