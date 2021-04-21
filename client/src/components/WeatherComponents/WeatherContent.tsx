import { Card, CardContent, CardHeader, Grid, Typography} from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import Weather from '../../interfaces/Weather';

interface Props{
  weatherData: Weather;
}

const Main = styled.div`
background: rgb(62,62,62);
background: linear-gradient(0deg, rgba(62,62,62,1) 0%, rgba(184,184,184,1) 100%);
  padding: 15px;
  color: white;
`;

const TextBox = styled.div`
  display: block;
  margin: 15px;
  padding: 15px;
  align-self: center;
  background-color: rgba(255,255,255,0.3);
  border-radius: 15px;
`;

const Place = styled.div`
  font-size: 3vw;
`;

const Date = styled.div`
  font-size: 1.5vw;
`;

const Temp = styled.div`
  font-size: 3vw;
  align-content: center;
`;

const FirstDescription = styled.div`
  font-size: 1.5vw;
`;

const SmallItem = styled.div`
  font-size: 1vw;
`;

const CardExampleCard = ({weatherData}: Props) => {
  const weatherForecast = 
      weatherData.cityName !== '' ? (
        <Main>
          <Grid container wrap="nowrap" spacing={2}>
                    <Grid item xs={4} style={{padding: '15px'}}>
                      <Place>{weatherData.cityName}, {weatherData.countryName}</Place>
                      <Date>{weatherData.date}</Date>
                      <br></br>
                      <Temp>{weatherData.temp}&deg;C</Temp>
                    </Grid>
                    <Grid item xs={8}>
                    <TextBox>
                      <Grid item>
                        <FirstDescription>{weatherData.description}</FirstDescription>
                      </Grid>
                      <br></br>
                      <Grid container wrap="nowrap" spacing={2}>
                        <Grid item xs={4}>
                          <SmallItem>Høyeste temperatur</SmallItem>
                          <FirstDescription>{weatherData.hiTemp}&deg;C</FirstDescription>
                        </Grid>
                        <Grid item xs={4}>
                          <SmallItem>Laveste temperatur</SmallItem>
                          <FirstDescription>{weatherData.loTemp}&deg;C</FirstDescription>
                        </Grid>
                        <Grid item xs={4}>
                          <SmallItem>Vindhastighet</SmallItem>
                          <FirstDescription>{weatherData.wind}m/s</FirstDescription>
                        </Grid>
                      </Grid>
                  </TextBox>
                    </Grid>
                </Grid>
        </Main>
      ) : (
        <Main>
          <TextBox>
          Værmelding er ikke tilgjengelig for denne økten
          </TextBox>
        </Main>
      )
  ;
  return (
    <div>{weatherForecast}</div>
  );
};

export default CardExampleCard;