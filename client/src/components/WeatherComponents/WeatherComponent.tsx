import React, { useEffect, useState } from 'react';
import Weather from '../../interfaces/Weather';
import WeatherContent from './WeatherContent';
/* Her hentast værmeldinga frå openweathermap og den rette værmeldinga vert sendt til
weathercontent*/


interface Props{
  lat: number;
  lon: number;
  time: number;
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
  const oldNum = new Number(dateRounded);
  const num = changeFormat(oldNum);
  const [weather, setWeather] = useState<Weather>({
    cityName: '',
    countryName: '',
    date: '',
    temp: 0,
    description: '',
    hiTemp: 0,
    loTemp: 0,
    wind: 0,
    icon: '',
    id: 0,
    main: '',
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
  function changeFormat(num: any) {
    let newNum = num/1000;
    newNum = newNum + 7200;
    return newNum;
  }

/* Hentar værmeldinger og finn den som stemmer for tidspunktet til økta */
  useEffect(() => {
    Promise.all([fetch(openWeatherURL+lat_long+join_key+units)])
    .then(([response]) => {
      if(response.ok){
      return Promise.all([response.json()]);
    }
    throw Error(response.statusText);
    })
    .then(([data]) => {
      for (const w in data.list){
        if(data.list[w].dt === num){
          setWeather({
            cityName: data.city.name,
            countryName: data.city.country,
            date: data.list[w].dt_txt,
            temp: data.list[w].main.temp,
            description: data.list[w].weather[0].description,
            hiTemp: data.list[w].main.temp_max,
            loTemp: data.list[w].main.temp_min,
            wind: data.list[w].wind.speed,
            icon: data.list[w].weather[0].icon,
            id: data.list[w].weather[0].id,
            main: data.list[w].weather[0].main,
          })
        }
      }
    })
    .catch(error => {
      console.log(error);
    });
  }, []); 

  return(
    <WeatherContent
      weatherData={weather}
    />
  )
}

export default WeatherComponent;