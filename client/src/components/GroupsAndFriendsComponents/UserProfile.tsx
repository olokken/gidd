import React, { useContext } from 'react';
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


const AvatarDiv = styled.div`
    justify-content: center;
     display: flex;
`;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    large: {
        width: 300,
        height: 300,
    },
}));

const SmallAvatar = withStyles((theme) => ({
    root: {
        width: 50,
        height: 50,
        border: `2px solid ${theme.palette.background.paper}`,
    },
}))(Avatar);

interface Props {
    updateFriends: () => void;
    friend: User;
    openPopup: boolean;
    setOpenPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserProfile = ({ friend, openPopup, setOpenPopup, updateFriends }: Props) => {
    const { user, setUser } = useContext(UserContext);
    const classes = useStyles();


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

    const getFriendRating = (friendId: string) => {
        const url = `${friendId}/rating`
        axios.get(url).then(response => { console.log(response.data) }).catch(error => {
            console.log('Kunne ikke hente rating' + error.message)
        });
    }


    return (
        <Card>
            <AvatarDiv>
                <Badge
                    overlap="circle"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    badgeContent={<SmallAvatar alt="Remy Sharp" src={verified} />}
                >
                    <Avatar src={friend.image} className={classes.large} />
                </Badge></AvatarDiv>
            <Rating
                readOnly
                name="read-onlu"
                defaultValue={3.67}
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
                    Aktivitetsgrad: {friend.activityLevel}
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
        </Card>
    );
}

export default UserProfile;