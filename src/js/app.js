// api keys
const openWeatherKey = 'c8ede0dabcc8a2159f5fd8390b1c9bb4';
const timezonedbKey = 'N1UY3YTWJI2S';

// api url
const baseUrl = 'https://api.openweathermap.org';
const weatherUrl = `${baseUrl}/data/2.5/weather`;
const openWeatherReverse = `${baseUrl}/geo/1.0/reverse`;
const openWeatherDirect = `${baseUrl}/geo/1.0/direct`;

let searchResults = [];

// helper functions

const checkIfInlocalStorage = (nameSaved) => {
  if (localStorage.getItem(nameSaved)) return true;
  return false;
}

const checkForGeolocateSupport = () => {
  if (navigator.geolocation) return true;
  return false;
}

// functions

const saveToLocal = (opject, array, saveName) => {
  array.push(opject);
  localStorage.setItem(saveName, JSON.stringify(array));
}

const getFromLocal = (nameSaved) => {
  return JSON.parse(localStorage.getItem(nameSaved))
}

const getWeatherByLongitude = async (longitude, latitude, units = 'metric') => {
  await axios(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherKey}&units=${units}`).then(response => console.log(response.data));
}

const getCityByLonLat = async (lon, lat, limit = 1) => {
  await axios(`${openWeatherReverse}?lat=${lat}&lon=${lon}&limit=${limit}&appid=${openWeatherKey}`).then(response => openSearchResults(response.data));
}

const getCityByQuery = async (query) => {
  await axios(`${openWeatherDirect}?q=${query}&limit=5&appid=${openWeatherKey}`).then(response => openSearchResults(response.data));
}

const getLocationFromCountry = () => {
  const city = document.querySelector('#city').value;
  const country = document.querySelector('#country').value;

  if (city && country) return getCityByQuery(`${city},${country}`);
  if (city) return getCityByQuery(city);
  if (country) return getCityByQuery(country);
  alert('Please enter a city and or country');
}

const getLocationFromBrowser = () => {
  navigator.geolocation.getCurrentPosition((pos) => {
    getCityByLonLat(pos.coords.longitude, pos.coords.latitude, 5);
  }, (err) => {
    console.log(err)
  });
}

const openSearchResults = (data) => {
  const searchResultsUL = document.querySelector('#search-results-ul');
  const dialog = document.querySelector('[data-popup="search-results"]');

  searchResultsUL.innerHTML = '';

  searchResults = data
  data.forEach(location => {
    const city = location.name,
      state = location.state,
      country = location.country,
      lat = location.lat,
      lon = location.lon;

    let li = document.createElement('li');
    li.setAttribute('data-search-result', '');
    let innerHtml = `
    <li data-search-result>
      <label>
        <input type="radio" name="city" value="${city}" id="${city}">
        <span>
          <h4>${city}</h4>
          <h5>${state}, ${country}</h5>
          <p>lat:${lat} lon:${lon}</p>
        </span>
      </label>
    </li>`;
    li.innerHTML = innerHtml;
    searchResultsUL.appendChild(li);
  })

  dialog.showModal();
};

const displayMessage = (message, querySelector) => {
  const messageElement = document.querySelector(querySelector);
  messageElement.innerHTML = message;
}

// event listeners

document.querySelectorAll('[data-clear]').forEach(button => {
  button.addEventListener('click', (e) => {
    const target = button.getAttribute('data-clear');
    if (document.querySelector(`#${target}`)) {
      document.querySelector(`#${target}`).value = '';
    } else if (document.querySelector(`.${target}`)) {
      document.querySelector(`.${target}`).innerHTML = '';
    } else {
      document.querySelector(`[${target}]`).value = '';
    }
  });
});

document.querySelectorAll('[data-get-location]').forEach(button => {
  button.addEventListener('click', () => {
    if (button.getAttribute('data-get-location') === 'browser') {
      return getLocationFromBrowser();
    }
    if (button.getAttribute('data-get-location') === 'country') {
      return getLocationFromCountry();
    }
    return console.log('error');
  })
});

document.querySelectorAll('[data-back-buttons]').forEach(button => {
  button.addEventListener('click', () => {
    const target = button.getAttribute('data-back-buttons');
    document.querySelector(`[data-popup="${target}"]`).close();
  });
});

document.querySelectorAll('[data-submit-buttons]').forEach(button => {
  button.addEventListener('click', () => {
    const radioInputs = document.querySelectorAll('[name="city"]');
    const target = button.getAttribute('data-submit-buttons');
    const dataPopup = document.querySelector(`[data-popup="${target}"]`);

    if (target === 'search-results') {
      const unit = document.querySelector('#unit').value;
      if (!unit === 'imperial' || !unit === 'metric') return alert('Please select a unit');
      radioInputs.forEach(input => {
        if (input.checked) {
          const city = input.value,
            locationData = searchResults.find(location => location.name === city),
            lat = locationData.lat,
            lon = locationData.lon;

          getWeatherByLongitude(lon, lat, unit);
          return dataPopup.close();
        }
      });
    } else {
      alert('error');
    }
  });
});