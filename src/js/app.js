// api keys
const openWeatherKey = 'c8ede0dabcc8a2159f5fd8390b1c9bb4';
const timezonedbKey = 'N1UY3YTWJI2S';

// api url
const baseUrl = 'https://api.openweathermap.org';
const weatherUrl = `${baseUrl}/data/2.5/weather`;
const openWeatherReverse = `${baseUrl}/geo/1.0/reverse`;
const openWeatherDirect = `${baseUrl}/geo/1.0/direct`;

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

const getWeatherByCity = async (city, units = 'metric') => {
  await axios(`${weatherUrl}?q=${city}&appid=${openWeatherKey}&units=${units}`).then(response => console.log(response.data));
}

const getCityByLonLat = async (lon, lat, limit = 1) => {
  await axios(`${openWeatherReverse}?lat=${lat}&lon=${lon}&limit=${limit}&appid=${openWeatherKey}`).then(response => {
    setChoosLocation(response.data)
    document.querySelector('[data-dialog="choose-location"]').showModal();
  });
}

const getCityByCityNameOrCountry = async (city, country) => {
  let query;
  if (city && country) {
    query = `${city},${country}`;
  } else if (!city) {
    query = `${country}`;
  } else {
    query = `${city}`;
  }
  await axios(`${openWeatherDirect}?q=${query}&appid=${openWeatherKey}&limit=5&appid=${openWeatherKey}`).then(response => {
    setChoosLocation(response.data);
    document.querySelector('[data-dialog="choose-location"]').showModal();
  });
}

const getLocationFromBrowser = () => {
  navigator.geolocation.getCurrentPosition((pos) => {
    getCityByLonLat(pos.coords.longitude, pos.coords.latitude, 5);
  }, (err) => {
    console.log(err)
  });
}

const setChoosLocation = (data) => {
  console.log(data);
  document.querySelector('[data-result="choose-location"]').innerHTML = '';
  data.forEach(place => {
    let li = document.createElement('li');
    li.innerHTML = `
    <label>
      <input type="checkbox" name="locations" value="${place.name}">
      <span>
        <h4>${place.name}</h4>
        <p>${place.state}, ${place.country}</p>
      </span>
    </label>`
    document.querySelector('[data-result="choose-location"]').appendChild(li);
  });
}

document.querySelectorAll('[data-open-dialog]').forEach(button => {
  button.addEventListener('click', () => {
    const target = button.getAttribute('data-open-dialog');
    const dialog = document.querySelector(`[data-dialog="${target}"]`);
    if (button.getAttribute('data-action') === 'getUserLocation') return getLocationFromBrowser();
    dialog.showModal();
  })
});

document.querySelectorAll('[data-close-dialog]').forEach(button => {
  button.addEventListener('click', () => {
    const target = button.getAttribute('data-close-dialog');
    const dialog = document.querySelector(`[data-dialog="${target}"]`);
    dialog.close();
  })
});

document.querySelectorAll('[data-form]').forEach(form => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const target = form.getAttribute('data-form');
    const dialog = document.querySelector(`[data-dialog="${target}"]`);

    if (target === 'choose-location') {
      const results = form.querySelectorAll('[name="locations"]');
      const units = form.querySelector('[name="units"]').value;

      results.forEach(result => {
        if (result.checked) {
          const city = result.value;
          getWeatherByCity(city, units);
          dialog.close();
        } else {
          console.log('no result selected');
        }
      });

    }

    if (target === 'choose-city-country') {
      // event.preventDefault();
      const city = form.querySelector('[name="cityName"]').value;
      const country = form.querySelector('[name="country"]').value;
      const error = document.querySelector('[data-choose-city-country-error]');
      const errors = [];
      if (city.length == 0 && country.length == 0) {
        errors.push('please enter a city and or country');
      } else if (city.length < 2 && !country) {
        errors.push('please enter a valid city');
      } else if (!country.length == 2 && !city) {
        errors.push('please enter a valid country');
      }

      if (!errors.length == 0) {
        console.log(errors);
        return error.innerHTML = errors.join('<br>');
      }
      // console.log(city, country);
      error.innerHTML = '';
      getCityByCityNameOrCountry(city, country);
      city.value = '';
      country.value = '';
    }
  })
});