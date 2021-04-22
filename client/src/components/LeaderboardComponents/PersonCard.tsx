import { Card, CardContent, Grid } from '@material-ui/core';
import React from 'react';

const PersonCard = ({person} : any) => {
    return (
        <Card>
            <CardContent>
                <Grid>
                    <Grid item xs={1}>
                        {person.placement}
                    </Grid>
                    <Grid item xs={9}>
                        {person.firstname + ' ' + person.lastname}
                    </Grid>
                    <Grid item xs={2}>
                        {person.points}
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default PersonCard;