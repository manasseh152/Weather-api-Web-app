// Api keys ↓

const { default: axios } = require("axios");

const openWeatherKey = 'c8ede0dabcc8a2159f5fd8390b1c9bb4'
const timezonedbKey = 'N1UY3YTWJI2S'

// Dom elements ↓

const main = document.querySelector('main');
const clock = document.querySelectorAll('[data-clock]');
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

const checkTime = (number) => {
  if (number < 10) return `0${number}`;
}

// Api functions

const getWeatherByCity = async (city, units = 'metric', callback) => {
  await axios(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherKey}&units=${units}`).then(response => callback(response))
}

const getWeatherByLongitude = async (longitude, latitude, units = 'metric', callback) => {
  await axios(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherKey}&units=${units}`).then(response => callback(response))
}

const getTimezoneByLongitude = async (longitude, latitude, callback) => {
  await axios(`http://api.timezonedb.com/v2.1/get-time-zone?key=${timezonedbKey}&format=json&by=position&lat=${latitude}&lng=${longitude}`).then(response => callback(response))
} 

// Run on load ↓
// Check for browser support ↓

if ('geolocation' in navigator) {
  if (navigator.geolocation) navigator.geolocation.getCurrentPosition(success);
}

// Eventlisteners ↓



// Start Clock ↓

const startClock = (elements,data = new Date()) => {
  let hour = data.getHours();
  let minute = data.getMinutes();
  minute = checkTime(minute);
  elements.forEach((element) => setInnerText(element, `${hour}:${minute}`));
  setTimeout(startClock(), 60000);
}