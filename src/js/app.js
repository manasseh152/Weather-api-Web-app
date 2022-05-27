const DateTime = luxon.DateTime;
const localStorageName = 'locations'

let locations = [];

// Api keys ↓
const openWeatherKey = 'c8ede0dabcc8a2159f5fd8390b1c9bb4'
const timezonedbKey = 'N1UY3YTWJI2S'

// DOM elements ↓
const weatherUl = document.querySelector('.weather-container')


// Functions ↓
const addOneCity = (name) => {
  const currentLocations = [...weatherUl.querySelectorAll('.weather-item')];
  if (currentLocations.find(o => o.getAttribute('data-location').toLowerCase() === name.toLowerCase())) return console.log('location is al toe gevoegd');
  let button = document.createElement('button')
  button.setAttribute('data-location', name)
  button.setAttribute('onclick', `openWeather('${name}')`)
  button.classList.add('weather-item');
  button.innerHTML = name
  appendChild(weatherUl, button);
  if (locations.find(o => o == name)) return console.log('bestaat all');
  saveToLocal(name, localStorageName);
}

const openWeather = (city) => {
  getWeatherByCity(city)
  document.querySelector('[data-info-location]').classList.toggle('active');
  document.querySelector('[data-toggel-add-location]').classList.toggle('active');
}

const loadFirstTime = () => {
  locations = getFromLocal(localStorageName)
  locations.forEach(element => addOneCity(element))
}

const loadWeatherData = (weather) => {
  const current = document.querySelector('[data-info-current]');
  current.innerHTML = `
  <h3>Current</h3>
  <p data-info-city="${weather.name}">${weather.name}</p>
  <p>${weather.main.temp}°</p>
  <p>${weather.weather[0].description}</p>
  <div>
    <div>
      <p>Feel:</p>
      <p>${weather.main.feels_like}°</p>
    </div>
    <div>
      <p>Humidity:</p>
      <p>${weather.main.humidity}</p>
    </div>
    <div>
      <p>Clouds:</p>
      <p>${weather.clouds.all}</p>
    </div>
  </div>
  `
}

const saveToLocal = (arr, saveName) => {
  locations.push(arr)
  const jsonarr = JSON.stringify(locations);
  localStorage.setItem(saveName, jsonarr);
}

const getFromLocal = (nameSaved) => {
  const str = localStorage.getItem(nameSaved);
  return JSON.parse(str)
}

const appendChild = (element, child) => {
  element.appendChild(child);
}

const success = (pos) => {
  getCityByLonLat(pos.coords.longitude, pos.coords.latitude)
}

const getWeatherByCity = async (city, units = 'metric') => {
  await axios(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherKey}&units=${units}`).then(response => loadWeatherData(response.data));
}

const getCityByLonLat = async (lon, lat, limit = 1) => {
  await axios(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=${limit}&appid=${openWeatherKey}`).then(response => addOneCity(response.data[0].name));
}

const getWeather = (longitude = undefined, latitude = undefined, city = undefined, units = undefined) => {
  if (!longitude == undefined && !latitude == undefined && city == undefined) {
    getWeatherByLongitude(longitude, latitude, units)
  }
  if (!city == undefined) {
    getWeatherByCity(city, units)
  }
}


// Run on load ↓
if (localStorage.getItem(localStorageName) != undefined) {
  loadFirstTime()
}

// Check for browser support ↓
if ('geolocation' in navigator) {
  if (navigator.geolocation) navigator.geolocation.getCurrentPosition(success);
}

document.querySelector('[data-toggel-add-location]').addEventListener('click', () => {
  document.querySelector('[data-info-location]').classList.toggle('active');
  document.querySelector('[data-toggel-add-location]').classList.toggle('active');
});

document.querySelector('[data-add-location-button]').addEventListener('click', () => {
  getWeatherByCity(document.querySelector('[data-add-location-input]').value)
  document.querySelector('[data-add-location-input]').value = '';
});

document.querySelector('[data-info-add-button]').addEventListener('click', () => {
  document.querySelector('[data-info-location]').classList.toggle('active');
  document.querySelector('[data-toggel-add-location]').classList.toggle('active');
  const location = document.querySelector('[data-info-city]');
  const city = location.getAttribute('data-info-city')
  addOneCity(city)
});

document.querySelector('[data-add-location-input]').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    getWeatherByCity(document.querySelector('[data-add-location-input]').value)
    document.querySelector('[data-add-location-input]').value = '';
  }
});