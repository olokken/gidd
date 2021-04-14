import { Card, CardActionArea, CardMedia, CardContent, Typography, Grid, Avatar, makeStyles, Theme, createStyles, Chip } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import Activity from '../../interfaces/Activity';


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
    return (
        <Card style={{maxWidth: '345px'}}>
            <CardActionArea>
                <CardMedia
                component="img"
                alt="Image related to the activity"
                height="140"
                image="../../assets/logo.png"
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Tidspunkt: {time.toDateString}
                    </Typography>
                    <Chip variant="outlined" size="small" label="{x}/{y}" />
                    <Chip variant="outlined" size="small" label={level} />
                    <Typography gutterBottom variant="h5" component="h3">
                        {title}
                    </Typography>
                    <Grid container wrap="nowrap" spacing={2}>
                        <Grid item>
                            <div className="tooltip"> {owner}
                                <Avatar>{owner.charAt(0)}</Avatar>
                            </div>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {description}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default ActivityCard;
