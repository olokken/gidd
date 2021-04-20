import React, { useState } from 'react';
import Weather from '../../interfaces/Weather';
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
  const latitude = new String(lat);
  const longitude = new String(lon);
  const dateExact = new Date(time);
  const dateRounded = roundThirdHour(dateExact);
  const openWeatherURL = "http://api.openweathermap.org/data/2.5/forecast?";
  const lat_long = "lat=" +latitude+ "&lon=" +longitude;
  const join_key = "&appid=" + "bf5aff56f689df8dd3147e0a62c61bac";
  const units = "&units=metric";
  const dateStringRounded = new String(dateRounded);
  const [weather, setWeather] = useState<Weather>({
    name: '',
    temp: 0,
});

  /* Runder av tida til nærmaste tredje time */
  function roundThirdHour(date: Date) {
    const myDate = date;
    myDate.setHours(myDate.getHours() + Math.round(myDate.getMinutes()/60));
    myDate.setMinutes(0, 0, 0);
    const diff = myDate.getHours()%3;
    if(diff===1){ myDate.setHours(myDate.getHours()-1)}
    if(diff===2){ myDate.setHours(myDate.getHours()+1)}

    return myDate;
}
/* Hentar værmeldinger og finn den som stemmer for tidspunktet til økta */
  Promise.all([fetch(openWeatherURL+lat_long+join_key+units)])
    .then(([response]) => {
      if(response.ok){
      return Promise.all([response.json()]);
    }
    throw Error(response.statusText);
    })
    .then(([data]) => {
      // sammenlign tid og dag
      // lagre denne infoen en stad
      console.log(data);
      const weather: any[] = data.list;
      const message : any = weather.filter(w => w.dt === dateRounded).find; 
                if (message) {
                  setWeather(message) 
                  console.log(message)
                }
      
    })
    .catch(error => {
      console.log(error);
    });

  return(
    <div>{dateStringRounded}</div>
  )
}

export default WeatherComponent;