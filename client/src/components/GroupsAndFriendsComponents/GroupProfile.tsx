import React, { useContext } from 'react';
import {
    Button,
    Card,
    CardContent,
    CardMedia,
    Typography,
} from '@material-ui/core';
import logo from '../../assets/logo.png';
import DeleteIcon from '@material-ui/icons/Delete';
import { UserContext } from '../../UserContext';
import axios from '../../Axios';
import Group from '../../interfaces/Group';
import config from '../../Config';

interface Props {
    group: Group;
    openPopup: boolean;
    setOpenPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const GroupProfile = ({ group, openPopup, setOpenPopup }: Props) => {
    const { user, setUser } = useContext(UserContext);

    const leaveGroup = () => {
        const groupId = group.groupId;
        axios
            .delete(`group/${groupId}/user/${user}`, config)
            .then((response) => {
                JSON.stringify(response);
                console.log(response.data);
            })
            .catch((error) =>
                console.log('Could not delete friend: ' + error.message)
            );
    };

    return (
        <Card>
            <CardMedia component="img" height="140" image={logo} />
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    {group.groupName}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    Epost: {group.groupName}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    Tlf: {group.groupName}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    Aktivitetsgrad: {group.groupName}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    Poeng: {group.groupName}
                </Typography>
                <div style={{ marginTop: '5px' }}>
                    <Button
                        fullWidth
                        onClick={leaveGroup}
                        variant="contained"
                        color="primary"
                    >
                        {' '}
                        Meld deg ut av gruppe{' '}
                        <DeleteIcon style={{ marginLeft: '8px' }} />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default GroupProfile;
