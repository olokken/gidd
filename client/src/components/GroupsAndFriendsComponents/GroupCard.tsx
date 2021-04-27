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
import Group from '../../interfaces/Group'

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
    handleGroupClicked: (group: Group) => void;
    onClick?: () => void;
}



const GroupCard = ({ group, handleGroupClicked, onClick }: Props) => {
    const [openPopup, setOpenPopup] = useState<boolean>(false);

    const onCardClick = () => {
        if (onClick != undefined) {
            onClick()
        }
    }
    return (
        <div>
            <Card
                style={{ minWidth: '100px', maxWidth: '100%', margin: '5px' }}
                onClick={() => {
                    handleGroupClicked(group)
                    onCardClick()
                }}
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