// console.log('fix-w-1.0.1');
// import myJson from '../data/condition.json' assert { type: 'json' };
localStorage.setItem('default-city', 'Харьков');
const weatherDay = document.querySelector('#weather-day');
const weatherWeek = document.querySelector('#weather-week');
const weather = document.querySelector('#weather-hour');

let meLocation = 'Харьков';

function locationWeather() {
  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    localStorage.setItem('location-city', `${latitude},${longitude}`);

    const searchCity = localStorage.getItem('search-city');
    if (searchCity === null) {
      meLocation = `${latitude},${longitude}`;
    } else if (searchCity === 'null') {
      meLocation = `${latitude},${longitude}`;
    } else {
      meLocation = meLocation;
    }

    fetchUsers7().then(data => {
      weatherW(data);
      weatherH(data);
      weatherD(data);
    });
  }

  function error() {
    const searchCity = localStorage.getItem('search-city');
    const locationCity = localStorage.getItem('location-city');

    meLocation = searchCity;

    if (searchCity === 'null') {
      meLocation = 'Харьков';
    } else if (locationCity === null) {
      meLocation = 'Харьков';
    }

    alert('Невозможно получить ваше местоположение');

    fetchUsers7().then(data => {
      weatherW(data);
      weatherH(data);
      weatherD(data);
    });
  }

  if (!navigator.geolocation) {
    alert('Geolocation не поддерживается вашим браузером');
  } else {
    weatherDay.innerHTML = 'Определение местоположения…';
    navigator.geolocation.getCurrentPosition(success, error);
  }
}
locationWeather();

const fetchUsers7 = async () => {
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=02f4d3b9a4c141c6b73150514232405&q=${meLocation}&days=14&lang=ru`,
    { referrerPolicy: 'origin-when-cross-origin' },
  );
  const data = await response.json();
  return data;
};

function weatherH(data) {
  const hourTwoDays = [];
  data.forecast.forecastday[0].hour.map(i => {
    let arr = i;
    arr.style = 'first-day';
    hourTwoDays.push(arr);
  });
  data.forecast.forecastday[1].hour.map(i => hourTwoDays.push(i));
  const date = new Date();
  const hourOneDay = hourTwoDays.splice(date.getHours(), 24);

  const hour = hourOneDay
    .map(
      i => `
<div class="hour-item">
<p class="${i.style}"><svg class="icon-time" width="24" height="24">
          <use href="./img/sprite.svg#icon-time"></use>
        </svg>${i.time.slice(11)}</p> 
        <p class="hour-item-temp">${i.feelslike_c}°C </p>
      <img src="${i.condition.icon}"></div>
      `,
    )
    .join('');

  weather.innerHTML = hour;
}

function weatherW(data) {
  const week = data.forecast.forecastday
    .map(i => {
      return `<ul>
        <li class="week-first-item"><p><svg class="icon-calendar" width="20" height="20">
          <use href="./img/sprite.svg#icon-calendar"></use>
        </svg>${i.date}</p><div class="week-humidity"><svg class="icon-humidity" width="24" height="24">
          <use href="./img/sprite.svg#icon-humidity"></use>
        </svg><p>${i.day.avghumidity}%</p></div> </li>
        <li></li>
        <li class="condition-week"> <p>${i.day.avgtemp_c}°C</p><img src='${i.day.condition.icon}'></li>
        <li>${i.day.condition.text}</li>
        
    </ul>`;
    })
    .join('');
  weatherWeek.innerHTML = week;
}

function weatherD(data) {
  const icon = data.current.condition.icon.slice(34);
  const timeSunsetH = data.forecast.forecastday[0].astro.sunset.slice(0, 2);
  const timeSunsetM = data.forecast.forecastday[0].astro.sunset.slice(3, -3);

  weatherDay.innerHTML = `<div class="day">
    <ul class="day-list">
        <li class="location"><button class="button-location" value="location" type="button">&#128204;</button>${
          data.location.country
        }, ${
    data.location.name
  } <input id="city"> <button class="button-search" type="button" value="search">🔍︎</button></li>
        <li>Таймзона: ${data.location.tz_id}</li>
        <li class="condition"><p><span>${
          data.current.feelslike_c
        }°C</span></p> <img src='//cdn.weatherapi.com/weather/128x128${icon}' widh=128 ></li>
        <li>${data.current.condition.text}</li>
        <li class="day-wind"><p>Скорость ветра: <span class="day-num">${(
          data.current.wind_kph / 3.6
        ).toFixed(
          2,
        )} м/с</span></p>  <svg class="icon-compass" width="24" height="24" style="transform: rotate(${
    136 + data.current.wind_degree
  }deg);">
          <use href="./img/sprite.svg#icon-compass"></use>
        </svg>
        </li>
        <li>Восход: <span class="day-num">${data.forecast.forecastday[0].astro.sunrise.slice(
          0,
          -3,
        )}</span></li>
        <li>Закат: <span class="day-num">${Number(timeSunsetH) + 12}:${timeSunsetM}</span></li>
        </ul>
        <ul class="card-day-list">
        <li class="card-day">
          <p><svg class="icon-sun" width="24" height="24">
          <use href="./img/sprite.svg#icon-sun"></use>
        </svg><span>УФ-индекс</span></p>
          <span class="day-num">${data.current.uv} из 10</span> </li>
        <li class="card-day"> <p><svg class="icon-pressure" width="24" height="24">
          <use href="./img/sprite.svg#icon-pressure"></use>
        </svg><span>Давление</span></p> <span class="day-num">${
          data.current.pressure_mb
        } мм</span> </li>
        <li class="card-day"> <p><svg class="icon-wind" width="24" height="24">
          <use href="./img/sprite.svg#icon-wind"></use>
        </svg><span>Порывы ветра</span></p>  <span class="day-num">${(
          data.forecast.forecastday[0].day.maxwind_kph / 3.6
        ).toFixed(2)} м/с</span> </li>
        <li class="card-day"> <p><svg class="icon-opacity" width="24" height="24">
          <use href="./img/sprite.svg#icon-opacity"></use>
        </svg><span>Количество осадков</span></p> <span class="day-num">${
          data.current.precip_mm
        } мм</span> </li>
        <li class="card-day"> <p><svg class="icon-humidity" width="24" height="24">
          <use href="./img/sprite.svg#icon-humidity"></use>
        </svg><span>Влажность</span></p> <span class="day-num">${
          data.current.humidity
        } %</span> </li>
        <li class="card-day"><p>
        <svg class="icon-cloudy" width="24" height="24">
          <use href="./img/sprite.svg#icon-cloudy"></use>
        </svg><span>Облачность</span></p> <span class="day-num">${data.current.cloud} %</span> </li>
        <li class="card-day"><p>
        <svg class="icon-thermometer" width="24" height="24">
          <use href="./img/sprite.svg#icon-thermometer"></use>
        </svg>По ощущениям температура</p> <span class="day-num">${
          data.current.feelslike_c
        }°C</span> </li>
        <li class="card-day"> <p><svg class="icon-eye" width="24" height="24">
          <use href="./img/sprite.svg#icon-eye"></use>
        </svg><span>Видимость</span></p> <span class="day-num">${
          data.current.vis_km
        } км</span> </li>
    </ul>
    <p class="update-time">Местное время, когда данные в реальном времени были обновлены: ${
      data.forecast.forecastday[0].day.last_updated
    }</p>
    </div>
    `;
}

setInterval(() => {
  fetchUsers7().then(data => {
    weatherW(data);
    weatherH(data);
    weatherD(data);
  });
}, 600000);

let city = '';
weatherDay.addEventListener('keyup', event => {
  if (event.target.id === 'city') {
    city = event.target.value;
    console.log(event.key);

    if (event.target.value.length > 2 && event.key == 'Enter') {
      localStorage.setItem('search-city', city);
      meLocation = city;
      console.log('event');
      fetchUsers7()
        .then(data => {
          weatherW(data);
          weatherH(data);
          weatherD(data);
        })
        .catch(error => {
          localStorage.setItem('search-city', null);
          const defaultCity = localStorage.getItem('default-city');
          const locationCity = localStorage.getItem('location-city');
          if (locationCity === null) {
            meLocation = defaultCity;
          } else if (searchCity === null) {
            meLocation = defaultCity;
          }
        });
    }
  }
});

weatherDay.addEventListener('click', event => {
  if (event.target.value === 'search') {
    localStorage.setItem('search-city', city);
    meLocation = city;
    fetchUsers7()
      .then(data => {
        weatherW(data);
        weatherH(data);
        weatherD(data);
      })
      .catch(error => {
        localStorage.setItem('search-city', null);
        const defaultCity = localStorage.getItem('default-city');
        const locationCity = localStorage.getItem('location-city');
        if (locationCity === null) {
          meLocation = defaultCity;
        } else if (searchCity === null) {
          meLocation = defaultCity;
        }
      });
  }

  if (event.target.value === 'location') {
    console.log('location');
    localStorage.setItem('search-city', null);
    locationWeather();
  }
});

// document.addEventListener('keyup', event => {
//   console.log('Keyup: ', event);
// });

// const defaultCity = localStorage.getItem('default-city');
// const searchCity = localStorage.getItem('search-city');
// const locationCity = localStorage.getItem('location-city');
// console.log('defaultCity: ', defaultCity);
// console.log('searchCity: ', searchCity);
// console.log('locationCity: ', locationCity);
