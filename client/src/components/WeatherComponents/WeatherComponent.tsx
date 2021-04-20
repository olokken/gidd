import React, { useState } from 'react';
import WeatherContent from './WeatherContent';
/* denne script-fila må hente ut alle data for været og 
sende det til ein weatherContent div*/

/* <WeatherContent
      weatherData={weather}
    />
*/

interface Props{
  lat: number;
  lon: number;
  time: string;
}

const WeatherComponent = ({ lat, lon, time }: Props) =>{
  const openWeatherURL = "http://api.openweathermap.org/data/2.5/forecast?";
  const latitude = new String(lat);
  const longitude = new String(lon);
  const dateExact = new Date(time);
  const dateRounded = roundMinutes(dateExact);
  const lat_long = "lat=" +latitude+ "&lon=" +longitude;
  const join_key = "&appid=" + "bf5aff56f689df8dd3147e0a62c61bac";
  const units = "&units=metric";
  const dateString = new String(dateRounded);

  function roundMinutes(date: Date) {

    date.setHours(date.getHours() + Math.round(date.getMinutes()/60));
    date.setMinutes(0, 0, 0); // Resets also seconds and milliseconds

    return date;
}

  Promise.all([fetch(openWeatherURL+lat_long+join_key+units)])
    .then(([response]) => {
      if(response.ok){
      return Promise.all([response.json()]);
    }
    throw Error(response.statusText);
    })
    .then(([data]) => {// sammenlign tid og dag
      //lagre denne infoen en stad
      console.log(data);
    })
    .catch(error => {
      console.log(error);
    });

  return(
    <div>{dateString}</div>
  )
}

export default WeatherComponent;