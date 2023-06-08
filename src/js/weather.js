import sprite from '../images/sprite.svg';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

localStorage.setItem('default-city', 'Киев');
const weatherDay = document.querySelector('#weather-day');
// const weatherWeek = document.querySelector('#weather-week');
const weather = document.querySelector('#weather-hour');
const btnWeatherHour = document.querySelector('#radio-1-weather');
const btnWeatherWeek = document.querySelector('#radio-2-weather');
let weatherDayTest = `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`;
let weatherHourTest = `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`;

let meLocation = 'умань';

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
      meLocation = searchCity;
    }

    fetchUsers7().then(data => {
      weatherW(data);
      weatherH(data);
      weatherD(data);
      renderHourDay();
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

    Notify.warning('Невозможно получить ваше местоположение');
    fetchUsers7().then(data => {
      weatherW(data);
      weatherH(data);
      weatherD(data);
      renderHourDay();
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
    // `https://api.weatherapi.com/v1/forecast.json?key=02f4d3b9a4c141c6b73150514232405&q=Харьков&days=14&lang=ru`,
    `https://api.weatherapi.com/v1/forecast.json?key=02f4d3b9a4c141c6b73150514232405&q=${meLocation}&days=14&lang=ru`,
    { referrerPolicy: 'origin-when-cross-origin' }
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
<div title="${i.condition.text}. Вероятность дождя ${
        i.chance_of_rain
      } %" class="hour-item">
<p class="${i.style}"><svg class="icon-time" width="24" height="24">
          <use href="${sprite}#icon-time"></use>
        </svg>${i.time.slice(11)}</p> 
        <p class="hour-item-temp">${i.feelslike_c}°C </p>
      <img src="${i.condition.icon}"></div>
      `
    )
    .join('');
  weatherHourTest = hour;
}

function weatherW(data) {
  const week = data.forecast.forecastday
    .map(i => {
      // **************************************************************************
      const {
        avghumidity = i.day.avghumidity,
        avgtemp_c = i.day.avgtemp_c,
        maxtemp_c = i.day.maxtemp_c,
        mintemp_c = i.day.mintemp_c,
        icon = i.day.condition.icon,
        conditionText = i.day.condition.text,
        daily_will_it_rain = i.day.daily_will_it_rain,
        daily_chance_of_rain = i.day.daily_chance_of_rain,
        daily_will_it_snow = i.day.daily_will_it_snow,
        daily_chance_of_snow = i.day.daily_chance_of_snow,
      } = i;
      const dayAndMonth = new Date(
        i.date.split('-').join(', ')
      ).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      });
      let precipitation = 0;
      if (daily_will_it_rain == 1) {
        precipitation = daily_chance_of_rain;
      } else if (daily_will_it_snow == 1) {
        precipitation = daily_chance_of_snow;
      } else precipitation = 0;
      // ****************************************************************************

      return `<ul class="panel-weather-day">
        <li class="week-first-item"><p><svg class="icon-calendar" width="20" height="20">
          <use href="${sprite}#icon-calendar"></use>
        </svg>${dayAndMonth}</p><div class="week-humidity">
        <li class="condition-text">${conditionText}</li>
        <li class="condition-week"> <p>${avgtemp_c}°C</p><img src='${icon}'></li>
        <li> <p>max t: ${maxtemp_c}°C</p></li>
        <li> <p>min t: ${mintemp_c}°C</p></li>
        <!-- <li> <p>Будет дождь: ${daily_will_it_rain}</p></li> -->
        <li> <p class="month-precipitation">Вероятность осадков: ${precipitation}%</p></li>
        <!-- <li> <p>Будет снег ${daily_will_it_snow}%</p></li> -->
        <!-- <li> <p>Вероятность снега ${daily_chance_of_snow}</p></li> -->
        <li class="condition-block-item">
            <svg width="32" height="32">
              <use href="${sprite}#icon-umbrella"></use></svg
          >${i.day.totalprecip_mm} мм
        </li>

          <p class="condition-block-item">
            <svg width="32" height="32">
              <use href="${sprite}#icon-clouds"></use>
            </svg>
            ${i.day.maxtemp_c} %
          </p>
          <p class="condition-block-item">
            <svg width="32" height="32">
              <use href="${sprite}#icon-eye3"></use>
            </svg>
            ${i.day.avgvis_km} км
          </p>
          <p class="condition-block-item">
            <svg width="32" height="32">
              <use href="${sprite}#icon-raindrop1"></use>
            </svg>
            ${avghumidity} %
          </p>
      
        
        
    </ul>`;
    })
    .join('');
  weatherDayTest = week;
}
// ????????????????????????????????????????????????????

let onRender = true;

btnWeatherHour.oninput = function () {
  onRender = true;
  renderHourDay();
};

btnWeatherWeek.oninput = function () {
  onRender = false;
  renderHourDay();
};

renderHourDay();

function renderHourDay() {
  if (onRender) {
    weather.innerHTML = weatherHourTest;
  } else {
    weather.innerHTML = weatherDayTest;
  }
}

// ???????????????????????????????????????????????????

//Карточка с погодой на текущее время
function weatherD(data) {
  const date = new Date();
  const options2 = {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  };
  const dayAndMonth = date.toLocaleDateString('ru-RU', options2);

  console.log(dayAndMonth); // Выведет текущий день недели

  const {
    country = data.location.country, //Страна
    city = data.location.name, //Город
    timeZone = data.location.tz_id, //Временная зона
    temperature = data.current.feelslike_c, //Текущая температура в градусах цельсия
    conditionText = data.current.condition.text, //Погодные условия, описание
    wind_ms = (data.current.wind_kph / 3.6).toFixed(2), //Скорость ветра в м/с
    wind_degree = data.current.wind_degree, //Направление ветра в градусах   data.current.wind_degree + 136,
    sunrise = data.forecast.forecastday[0].astro.sunrise.slice(0, -3), //Время рассвета
    sunsetH = Number(data.forecast.forecastday[0].astro.sunset.slice(0, 2)) +
      12, //Время заката - часы
    sunsetM = data.forecast.forecastday[0].astro.sunset.slice(3, -3), //Время заката - минуты
    icon = data.current.condition.icon.slice(34), //Иконка погодных условий
    pressure_mb = data.current.pressure_mb, //Давление мм рт сб
    cloud = data.current.cloud, // Облачность
    vis_km = data.current.vis_km, // Видимость километров
    humidity = data.current.humidity, // Влажность
    maxwind_ms = (data.forecast.forecastday[0].day.maxwind_kph / 3.6).toFixed(
      2
    ), // Порывы ветра м/с
    uv = data.current.uv, // Ультрофиолет
    precip_mm = data.current.precip_mm, // Осадки мм
    moonrise = data.forecast.forecastday[0].astro.moonrise,
    moonset = data.forecast.forecastday[0].astro.moonset,
    last_updated = data.current.last_updated,
  } = data;

  let moonrise24 = '--:--';
  let moonset24 = '--:--';

  if (moonrise.slice(6) == 'PM') {
    moonrise24 = `${Number(moonrise.slice(0, 2)) + 12}:${moonrise.slice(3, 5)}`;
  } else moonrise24 = moonrise.slice(5);

  if (moonset.slice(6) == 'PM') {
    moonrise24 = `${Number(moonset.slice(0, 2)) + 12}:${moonset.slice(3, 5)}`;
  } else moonset24 = moonset.slice(0, 5);

  weatherDay.innerHTML = `
  
  <div class="day-list">
    <div class="location">
      <button class="button-location" value="location" type="button">
        &#128204;
      </button>
      <div class="inputbox">
        <input required="required" id="city" /><span>${country}, ${city} </span
        ><i></i>
      </div>
      <button class="button-search" type="button" value="search">🔍︎</button>
    </div>
    <div class="location-line"></div>
    <div>${timeZone}, ${dayAndMonth}</div>
    <p class="condition-text">${conditionText}</p>
    <div class="condition">
      <div class="condition-block-left">
        <span>${temperature}°</span>
        <div class="condition-block-small">
          <p title="Количество осадков" class="condition-block-item">
            <svg width="32" height="32">
              <use href="${sprite}#icon-umbrella"></use></svg
          >${precip_mm} мм
        </p>

          <p  title="Облачность" class="condition-block-item">
            <svg width="32" height="32">
              <use href="${sprite}#icon-clouds"></use>
            </svg>
            ${cloud} %
          </p>
          <p title="Видимость" class="condition-block-item">
            <svg width="32" height="32">
              <use href="${sprite}#icon-eye3"></use>
            </svg>
            ${vis_km} км
          </p>
          <p title="Влажность" class="condition-block-item">
            <svg width="32" height="32">
              <use href="${sprite}#icon-raindrop1"></use>
            </svg>
            ${humidity} %
          </p>
        </div>
      </div>

      <div class="condition-block">
        <img src="//cdn.weatherapi.com/weather/128x128${icon}" widh="128" />
      </div>
    </div>
    <div class="condition-block-bottom">
      <div>
        <p title="Восход солнца" class="condition-block-item">
          <svg width="32" height="32">
            <use href="${sprite}#icon-sunrise"></use></svg
          >${sunrise}
        </p>
        <p title="Закат солнца" class="condition-block-item">
          <svg width="32" height="32">
            <use href="${sprite}#icon-sunset"></use></svg
          >${sunsetH}:${sunsetM}
        </p>
         <p title="Восход луны" class="condition-block-item">
          <svg width="32" height="32">
            <use href="${sprite}#icon-moonrise"></use></svg
          >${moonrise24}
        </p>
        <p title="Закат луны" class="condition-block-item">
          <svg width="32" height="32">
            <use href="${sprite}#icon-moonset"></use></svg
          >${moonset24}
        </p>
      </div>
      <div>
        <p title="Скорость и направление ветра" class="condition-block-item">
          <svg width="32" height="32">
            <use href="${sprite}#icon-air-sock"></use></svg
          >${wind_ms} м/с &#160;
          <svg width="32" height="32"
            style="transform: rotate(${wind_degree}deg)"
          >
            <use href="${sprite}#icon-wind-w"></use>
          </svg>
        </p>
        <p  title="Ультрофиолет" class="condition-block-item">
          <svg width="32" height="32">
            <use href="${sprite}#icon-sun"></use></svg
          >${uv}/10 UV
        </p>
        <p title="Порывы ветра" class="condition-block-item">
          <svg width="32" height="32">
            <use href="${sprite}#icon-wind"></use></svg
          >${maxwind_ms} м/с
        </p>
     
        <p  title="Давление" class="condition-block-item">
            <svg width="32" height="32">
              <use href="${sprite}#icon-barometer"></use>
            </svg>
            ${pressure_mb}мм
          </p>
      </div>
    </div>
  </div>

  <p class="update-time">
    Последнее обновление:
    ${last_updated}
  </p>

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
    // console.log(event.key);

    if (event.target.value.length > 2 && event.key == 'Enter') {
      localStorage.setItem('search-city', city);
      meLocation = city;
      // console.log('event');
      fetchUsers7()
        .then(data => {
          weatherW(data);
          weatherH(data);
          weatherD(data);
        })
        .catch(error => {
          localStorage.setItem('search-city', null);
          Notify.warning('Такой город не найден');
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
        Notify.warning('Такой город не найден');
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
    // console.log('location');
    localStorage.setItem('search-city', null);
    locationWeather();
  }
});
