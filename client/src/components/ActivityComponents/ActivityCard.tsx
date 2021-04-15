import { Card,  CardMedia, CardContent, Typography, Grid, Avatar, Tooltip, Chip } from '@material-ui/core';
import React, { useState } from 'react';
import styled from 'styled-components';
import Activity from '../../interfaces/Activity';
import ActivityInformation from './ActivityInformation';
import ActivityPopup from './CreateActivity/ActivityPopup';

const CardInformation = styled.div`
    height: 100%;

    :hover{
        background-color: #ebebeb
    }
`;
const TitleArea = styled.div`
    padding-left: 15px;
    color: white;
    background-color: #3f51b5;
`;


const ActivityCard = ({
    ID,
    title,
    time,
    owner,
    capacity,
    maxCapacity,
    description,
    level,
}: Activity) => {
    const participants = new String(capacity);
    const fullCapacity = new String(maxCapacity);
    const comparison = new String(participants + "/" + fullCapacity);
    const eventTime = new String(time);
    const [openPopup, setOpenPopup] = useState<boolean>(false);

    const onClickActivity = () => {
        setOpenPopup(!openPopup);
    }
    return (
        <Card onClick={onClickActivity} style={{minWidth: '200px', maxWidth: '31%', margin: '5px'}}>
            <ActivityPopup
                        title={title}
                        openPopup={openPopup}
                        setOpenPopup={setOpenPopup}
                    >
                  <ActivityInformation 
                        ID={ID}
                        title={title}
                        time={time}
                        owner={owner}
                        capacity={capacity}
                        maxCapacity={maxCapacity}
                        description={description}
                        level={level}
                  >
                    </ActivityInformation>  
            </ActivityPopup>
            <CardInformation>
                <CardMedia
                component="img"
                alt={"Image related to the activity" + title}
                height="140"
                image ={require("../../assets/GIDD.png")}
                />
                    <TitleArea>
                        <Grid container wrap="nowrap" spacing={2}>
                            <Grid item>
                                <Typography gutterBottom variant="h5" component="h3">
                                    {title}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Chip variant="outlined" size="small" label={comparison} style={{backgroundColor: "#8c98d8", borderBlockEndWidth: "0px", color: "white"}}/>
                                <Chip variant="outlined" size="small" label={level} style={{backgroundColor: "#8c98d8", borderBlockEndWidth: "0px", color: "white"}}/>
                            </Grid>
                        </Grid>
                    </TitleArea>
                <CardContent>
                    <Grid container wrap="nowrap" spacing={2}>
                        <Grid item>
                            <Tooltip title={owner}>
                                <Avatar>{owner.charAt(0)}</Avatar>
                            </Tooltip>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {eventTime}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Typography variant="body2" color="textSecondary" component="p" style={{color: 'black'}}>
                        {description}
                    </Typography>
                </CardContent>
            </CardInformation>
        </Card>
        
    );
};

export default ActivityCard;
