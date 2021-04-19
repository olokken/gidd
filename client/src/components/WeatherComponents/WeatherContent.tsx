import { Card, CardContent, CardHeader } from '@material-ui/core';
import React from 'react';


const CardExampleCard = ({weatherData}) => (
  <Card>
    <CardContent>
        <CardHeader className="header">{weatherData.name}</CardHeader>
    </CardContent>
  </Card>
)

export default CardExampleCard;