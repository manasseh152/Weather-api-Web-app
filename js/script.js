const DateTime = luxon.DateTime;

let clockStatus = false;

// Api keys ↓
const openWeatherKey = 'c8ede0dabcc8a2159f5fd8390b1c9bb4'
const timezonedbKey = 'N1UY3YTWJI2S'

// Dom elements ↓
const main = document.querySelector('main');
const clock = [...document.querySelectorAll('[data-clock]')]
const temp = document.querySelector('#temperature');
const title = document.querySelector('title');
const wndPntr = document.querySelector('#Pointer');
const wthrImg = document.querySelectorAll('[data-image]');
const wthrIcn = document.querySelectorAll('[data-favicon]');
const wthrDsc = document.querySelector('#weatherDiscription');
const loctInp = document.querySelector('#searchLocationInput');
const loctbtn = document.querySelector('#searchLocationButton');


// Functions ↓

const setInnerText = (element, text, add = undefined) => {
  if (add === undefined) return element.innerHTML = text;
  element.innerHTML += text
}

const startUpClock = (timezone) => {
  if (clockStatus == false) return;
  const now = DateTime.now().setZone(timezone).toFormat("HH:mm:ss")
  clock.forEach((element) => setInnerText(element, now));
  setTimeout(() => {
    startUpClock(timezone)
  }, 1000);
}

const loadweather = (weather) => {
  wthrIcn.forEach((element) => element.href = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
  wthrImg.forEach((element) => element.src = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);

  setInnerText(title, `: ${weather.weather[0].description}`, true);
  setInnerText(wthrDsc, weather.weather[0].description);
  setInnerText(temp, `${Math.round(weather.main.temp * 10) / 10}°`);

  loctInp.setAttribute('placeholder', weather.name);

  wndPntr.style.transform = `rotate(${weather.wind.deg}deg)`;

  clockStatus = true;

  getTimezoneByLongitude(weather.coord.lon, weather.coord.lat);

  // console.log(weather)
}

const success = (pos) => {
  getWeatherByLongitude(pos.coords.longitude, pos.coords.latitude, undefined)
}

// Api functions

const getWeatherByCity = async (city, units = 'metric') => {
  await axios(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherKey}&units=${units}`).then(response => loadweather(response.data));
}

const getWeatherByLongitude = async (longitude, latitude, units = 'metric') => {
  await axios(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherKey}&units=${units}`).then(response => loadweather(response.data));
}

const getTimezoneByLongitude = async (longitude, latitude) => {
  await axios(`http://api.timezonedb.com/v2.1/get-time-zone?key=${timezonedbKey}&format=json&by=position&lat=${latitude}&lng=${longitude}`).then(response => startUpClock(response.data.zoneName));
}

const getWeather = (longitude = undefined, latitude = undefined, city = undefined, units = undefined) => {
  if (!longitude == undefined && !latitude == undefined && city == undefined) {
    getWeatherByLongitude(longitude, latitude, units, loadweather())
  }
  if (!city == undefined) {
    getWeatherByCity(city, units, loadweather())
  }
}


// Run on load ↓
// Check for browser support ↓

if ('geolocation' in navigator) {
  if (navigator.geolocation) navigator.geolocation.getCurrentPosition(success);
}

// Eventlisteners ↓

loctbtn.addEventListener('click', (e) => {
  clockStatus = false
  setTimeout((e = loctInp.value) => {
    getWeatherByCity(e)
    loctInp.value = '';
  }, 1);
});

loctInp.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    clockStatus = false
    setTimeout(() => {
      getWeatherByCity(loctInp.value)
      loctInp.value = '';
    }, 1000);
  }
});