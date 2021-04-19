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
import Activity from '../../interfaces/Activity';
import hiking from '../../assets/hiking.jpg';
import { convertToObject } from 'typescript';
import ActivityResponse from '../../interfaces/ActivityResponse';

const CardInformation = styled.div`
    height: 100%;

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
    activity: ActivityResponse;
    openPopup: boolean;
    setOpenPopup: React.Dispatch<React.SetStateAction<boolean>>;
    setActivity: any;
}

const ActivityCard = ({
    activity,
    openPopup,
    setOpenPopup,
    setActivity,
}: Props) => {
    const participants = new String(activity.registeredParticipants.length);
    const fullCapacity = new String(activity.capacity);
    const comparison = new String(participants + '/' + fullCapacity);
    const eventTime = new String(activity.time);

    const onClickActivity = () => {
        setOpenPopup(!openPopup);
        setActivity(activity);
    };
    return (
        <Card
            onClick={onClickActivity}
            style={{ minWidth: '200px', maxWidth: '31%', margin: '5px' }}
        >
            <CardInformation>
                <Grid>
                    <Grid item>
                        <CardMedia
                            component="img"
                            alt={
                                'Image related to the activity' + activity.title
                            }
                            height="140"
                            image={hiking} // hente bildet frå aktiviteta
                        />
                    </Grid>
                </Grid>
                <TitleArea>
                    <Grid container wrap="nowrap" spacing={2}>
                        <Grid item xs={8}>
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="h3"
                            >
                                {activity.title}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Chip
                                variant="outlined"
                                size="small"
                                label={comparison}
                                style={{
                                    backgroundColor: '#ffa6a0',
                                    borderBlockEndWidth: '0px',
                                    color: 'white',
                                }}
                            />
                            <Chip
                                variant="outlined"
                                size="small"
                                label={activity.activityLevel}
                                style={{
                                    backgroundColor: '#ffa6a0',
                                    borderBlockEndWidth: '0px',
                                    color: 'white',
                                }}
                            />
                        </Grid>
                    </Grid>
                </TitleArea>
                <CardContent>
                    <Grid container wrap="nowrap" spacing={2}>
                        <Grid item>
                            <Tooltip title={activity.user['firstname']}>
                                <Avatar>{activity.user['firstname']}</Avatar>
                            </Tooltip>
                        </Grid>
                        <Grid item xs>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                component="p"
                            >
                                {eventTime}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                        style={{ color: 'black' }}
                    >
                        {activity.description}
                    </Typography>
                </CardContent>
            </CardInformation>
        </Card>
    );
};

export default ActivityCard;
