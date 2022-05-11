// Open Weather

const weatherKey = 'c8ede0dabcc8a2159f5fd8390b1c9bb4';

if ('geolocation' in navigator) {
  const success = (pos) => {
    weatherApi(undefined, undefined, pos.coords.latitude, pos.coords.longitude)
  };
  if (navigator.geolocation) navigator.geolocation.getCurrentPosition(success);
}

const weatherApi = async (city, units = 'metric', latitude, longitude) => {
  if (city !== undefined) {
    return axios(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherKey}&units=${units}`)
      .then(data => displayWeather(data.data));
  }
  await axios(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherKey}&units=${units}`)
    .then(data => displayWeather(data.data));
}

const displayWeather = (weather) => {
  favicon.href = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
  title.innerHTML += `: ${weather.weather[0].description}`
  console.log(weather)
}

//  close Open Weather

// Put all dom selectors downbelow ↓
const body = document.body;
const favicon = document.querySelector('link[data-favicon]')
const title = document.querySelector('title');