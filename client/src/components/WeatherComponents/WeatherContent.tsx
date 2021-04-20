import { Card, CardContent, CardHeader } from '@material-ui/core';
import React from 'react';
import Weather from '../../interfaces/Weather';

interface Props{
  weatherData: Weather;
}

const CardExampleCard = ({weatherData}: Props) => (
  <Card>
    <CardContent>
        <CardHeader className="header">{weatherData.name}</CardHeader>
    </CardContent>
  </Card>
)

export default CardExampleCard;