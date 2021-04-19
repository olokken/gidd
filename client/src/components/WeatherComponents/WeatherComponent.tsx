import React from 'react';

interface Props{
  lat: number;
  lon: number;
  time: string;
}

const WeatherComponent = ({ lat, lon, time }: Props) =>{
  return(
    <div>HI!</div>
  )
}

export default WeatherComponent;