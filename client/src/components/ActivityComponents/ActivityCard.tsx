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
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import styled from 'styled-components';
import hiking from '../../assets/hiking.jpg';
import ActivityResponse from '../../interfaces/ActivityResponse';

const useStyles = makeStyles({
    cutText: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        height: '1.2em',
        whiteSpace: 'nowrap',
    },
});

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
    const date = new Date(activity.time);
    const eventTime = new String(date).substring(0, 24);
    const classes = useStyles();

    const onClickActivity = () => {
        setOpenPopup(!openPopup);
        console.log(activity)
        setActivity(activity);
    };

    const picture = (): any => {
        if (activity.image.length > 40) {
            return activity.image;
        }
        return hiking;
    };
    return (
        <Card
            onClick={onClickActivity}
            style={{
                height: '20rem',
            }}
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
                            image={picture()} // hente bildet frå aktiviteta
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
                            <Tooltip title={activity.user.firstname}>
                                <Avatar>{activity.user.firstname}</Avatar>
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
                        className={classes.cutText}
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
