import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Grid,
    Avatar,
    Tooltip,
    Chip,
    withStyles,
} from '@material-ui/core';
import React, { useState } from 'react';
import styled from 'styled-components';
import logo from '../../assets/logo.png';
import User from '../../interfaces/User';
import Popup from '../Popup';
import UserProfile from './UserProfile';
import Badge from '@material-ui/core/Badge';
import verified from '../../assets/verified.png'

const CardInformation = styled.div`
    height: 100%;
    cursor: pointer;

    :hover {
        background-color: #ebebeb;
    }
`;
const TitleArea = styled.div`
    flex: 1;
    padding: 15px;
    color: white;
    background-color: #f44336;
`;

interface Props {
    friend: User;
    updateFriends: () => void;
}

const SmallAvatar = withStyles((theme) => ({
    root: {
        width: 18,
        height: 18,
        border: `2px solid ${theme.palette.background.paper}`,
    },
}))(Avatar);


const FriendCard = ({ friend, updateFriends }: Props) => {
    const [openPopup, setOpenPopup] = useState<boolean>(false);

    const onCardClick = () => {
        setOpenPopup(!openPopup)
    }
    return (
        <div>
            <Card
                style={{ minWidth: '100px', maxWidth: '100%', margin: '5px' }}
                onClick={onCardClick}
            >

                <CardInformation>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <Badge
                                overlap="circle"
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                badgeContent={<SmallAvatar src={verified}/>}
                            >
                                <Avatar src={friend.image} />
                            </Badge>
                        </Grid>
                        <Grid item >
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
                />
            </Popup>
        </div>
    );
};

export default FriendCard;