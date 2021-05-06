import {
    Card,

    Typography,
    Grid,

} from '@material-ui/core';
import React, { useState } from 'react';
import styled from 'styled-components';
import User from '../../interfaces/User';
import Popup from '../Popup';
import UserProfile from './UserProfile';
import axios from '../../Axios';
import UserAvatar from '../../components/UserAvatar';

const CardInformation = styled.div`
    height: 100%;
    cursor: pointer;

    :hover {
        background-color: #ebebeb;
    }
`;


interface Props {
    friend: User;
    updateFriends: () => void;
}

const FriendCard = ({ friend, updateFriends }: Props) => {
    const [openPopup, setOpenPopup] = useState<boolean>(false);
    const [friendRating, setFriendRating] = useState<number | undefined>();

    const getFriendRating = (friendId: string) => {
        const url = `user/${friendId}/rating`;
        axios
            .get(url)
            .then((response) => {
                setFriendRating(response.data.averageRating);
            })
            .catch((error) => {
                console.log('Kunne ikke hente rating' + error.message);
            });
    };

    const onCardClick = () => {
        getFriendRating(friend['userId']);
        setOpenPopup(!openPopup);
    };

    return (
        <div>
            <Card
                style={{ minWidth: '100px', maxWidth: '100%', margin: '5px' }}
                onClick={onCardClick}
            >
                <CardInformation>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <UserAvatar user={friend} type="small"></UserAvatar>
                        </Grid>
                        <Grid item>
                            <Typography
                                gutterBottom
                                variant="subtitle2"
                                component="h3"
                            >
                                {friend.firstName + ' ' + friend.surname}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardInformation>
            </Card>
            <Popup
                title={friend.firstName + ' ' + friend.surname}
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
                <UserProfile
                    updateFriends={updateFriends}
                    openPopup={openPopup}
                    setOpenPopup={setOpenPopup}
                    friend={friend}
                    friendRating={friendRating}
                />
            </Popup>
        </div>
    );
};

export default FriendCard;
