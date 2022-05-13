const weatherKey = 'c8ede0dabcc8a2159f5fd8390b1c9bb4';
const timezonedb = 'N1UY3YTWJI2S'

if ('geolocation' in navigator) {
  const success = (pos) => {
    weatherApi(undefined, undefined, pos.coords.latitude, pos.coords.longitude);
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

const getLonLat = async (place) => {
  console.log(place)
  await axios(`https://api.openweathermap.org//data/2.5/weather?q=${place}&appid=${weatherKey}`).then(response => getTimezone(response.data.coord.lon, response.data.coord.lat));
}

const getTimezone = async (lon, lat) => {
  axios(`http://api.timezonedb.com/v2.1/get-time-zone?key=${timezonedb}&format=json&by=position&lat=${lat}&lng=${lon}`).then(response => console.log(response.data))
}

const displayWeather = (weather) => {
  wthrIcn.forEach((element) => element.href = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
  wthrImg.forEach((element) => element.src = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
  time.forEach((element) => setInnerText(element, `${getTime()}`));

  setInnerText(title, `: ${weather.weather[0].description}`, true);
  setInnerText(wthrDsc, weather.weather[0].description);
  setInnerText(temp, `${Math.round(weather.main.temp * 10) / 10}°`);

  loctInp.setAttribute('placeholder', weather.name);

  wndPntr.style.transform = `rotate(${weather.wind.deg}deg)`;
  main.style.background = `linear-gradient(180deg, #000532 0%, #436BCE 0%, #83C3FF 100%)`;

  console.log()
}

//  close Open Weather

// Put all dom selectors downbelow ↓

const main = document.querySelector('main');
const time = document.querySelectorAll('#time');
const temp = document.querySelector('#temperature');
const title = document.querySelector('title');
const wndPntr = document.querySelector('#Pointer');
const wthrImg = document.querySelectorAll('[data-image]');
const wthrIcn = document.querySelectorAll('[data-favicon]');
const wthrDsc = document.querySelector('#weatherDiscription');
const loctInp = document.querySelector('#searchLocationInput');
const loctbtn = document.querySelector('#searchLocationButton');

// Reusable function ↓

const getTime = (timestamp = undefined) => {
  if (timestamp === undefined) {
    let hour = new Date().getHours()
    let minute = new Date().getMinutes()
    if (hour < 9) hour = `0${hour}`;
    if (minute < 9) minute = `0${minute}`;
    return `${hour}:${minute}`
  };
  return new Date(timestamp);
}

const setInnerText = (element, text, add = undefined) => {
  if (add === undefined) return element.innerHTML = text;
  element.innerHTML += text
}



// eventlisteners

loctbtn.addEventListener('click', (e) => {
  weatherApi(loctInp.value)
  loctInp.value = '';
});

loctInp.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    weatherApi(loctInp.value)
    loctInp.value = '';
  }
});