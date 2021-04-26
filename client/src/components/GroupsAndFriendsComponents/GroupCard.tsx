import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Grid,
    Avatar,
    Tooltip,
    Chip,
} from '@material-ui/core';
import React, { useState } from 'react';
import styled from 'styled-components';
import logo from '../../assets/logo.png';
import User from '../../interfaces/User';
import Popup from '../Popup';
import GroupProfile from './GroupProfile';
import UserProfile from './UserProfile';

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
    group: Group;
}

interface Group {
    owner: User;
    groupName: string;
    groupId: string;
    users: User[];
}


const GroupCard = ({ group }: Props) => {
    const [openPopup, setOpenPopup] = useState<boolean>(false);
    return (
        <div>
            <Card
                style={{ minWidth: '100px', maxWidth: '100%', margin: '5px' }}
                onClick={() => console.log(group)}
            >

                <CardInformation>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <CardMedia
                                component="img"
                                alt={'Image related to the activity'}
                                height="40px"
                                width="40px"
                                image={logo} // hente bildet frå aktiviteta
                            />
                        </Grid>
                        <Grid item >
                            <Typography
                                gutterBottom
                                variant="subtitle2"
                                component="h3"
                            >
                                {group.groupName}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardInformation>
            </Card>
            <Popup
                title={group.groupName}
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
                <GroupProfile
                    openPopup={openPopup}
                    setOpenPopup={setOpenPopup}
                    group={group}
                />
            </Popup>
        </div>
    );
};

export default GroupCard;