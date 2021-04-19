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
  const lat_long = "lat=" + lat.toString + "&lon=" + lon.toString;
  const join_key = "&appid=" + "b6907d289e10d714a6e88b30761fae22";
  const units = "&units=metric";

  return(
    <div>HI</div>
  )
}

export default WeatherComponent;