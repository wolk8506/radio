// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// *  b8b2f3c187f97d30e013b6b54969cb8c

//*   https://api.openweathermap.org/data/2.5/forecast?lat=49.982&lon=36.2566&appid=b8b2f3c187f97d30e013b6b54969cb8c&lang=ru

//*   https://api.openweathermap.org/data/2.5/forecast?q=%D0%9A%D0%B8%D0%B5%D0%B2&appid=b8b2f3c187f97d30e013b6b54969cb8c&lang=ru

//*   https://openweathermap.org/img/wn/10d@4x.png

//*   https://ipapi.co/json/

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

import sprite from '../images/sprite.svg';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import axios from 'axios';

const weatherDay = document.querySelector('#weather-day');
const weather = document.querySelector('#weather-hour');
const btnWeatherHour = document.querySelector('#radio-1-weather');
const btnWeatherWeek = document.querySelector('#radio-2-weather');
let weatherHourTest = '';
let weatherDayTest = '';
let city = '';
let oNwriteCity = false;
let onRender = true;
const initialStateWeather = JSON.parse(
  localStorage.getItem('initialStateWeather')
);

setInterval(() => {
  startSearch();
}, 600000);

startSearch();
function startSearch() {
  const latitude = JSON.parse(localStorage.getItem('latitude'));
  const longitude = JSON.parse(localStorage.getItem('longitude'));
  const search_city = localStorage.getItem('search_city');
  if (
    initialStateWeather === null ||
    (latitude === null && search_city === 'null')
  ) {
    console.log('gthdfz bybwbfkbpfwbz');
    axios
      .request(`https://ipapi.co/json/`)
      .then(function (response) {
        localStorage.setItem('latitude', response.data.latitude);
        localStorage.setItem('longitude', response.data.longitude);
        weatherFourDay(
          `lat=${response.data.latitude}&lon=${response.data.longitude}`
        );
        weatherOneDay(`${response.data.latitude},${response.data.longitude}`);
      })
      .catch(function (error) {
        console.log('❌ Error: ', error.message);
      })
      .finally(function () {});
    localStorage.setItem('initialStateWeather', true);
  } else {
    if (search_city && search_city !== 'null') {
      weatherFourDay(`q=${search_city}`);
      weatherOneDay(search_city);
    } else if (latitude) {
      weatherFourDay(`lat=${latitude}&lon=${longitude}`);
      weatherOneDay(`${latitude},${longitude}`);
    } else {
      weatherFourDay(`q=Харьков`);
      weatherOneDay(`Харьков`);
    }
  }
}

function weatherOneDay(q) {
  weather.innerHTML = `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`;

  axios
    .request(
      `https://api.weatherapi.com/v1/forecast.json?key=02f4d3b9a4c141c6b73150514232405&q=${q}&days=14&lang=ru`
    )
    .then(function (response) {
      weatherD(response.data);
      weatherH(response.data);
      renderHourDay();
      if (oNwriteCity) {
        localStorage.setItem('search_city', city);
        oNwriteCity = false;
      }
    })
    .catch(function (error) {
      console.log('❌ Error: ', error.message);
      if (oNwriteCity) {
        Notify.failure('Такой город не найден');
        oNwriteCity = false;
      }
      startSearch();
    })
    .finally(function () {});
}

function weatherFourDay(q) {
  axios
    .request(
      `https://api.openweathermap.org/data/2.5/forecast?${q}&appid=b8b2f3c187f97d30e013b6b54969cb8c&lang=ru`
    )
    .then(function (response) {
      // console.log(response.data);
      fourDayWeather(response.data);
    })
    .catch(function (error) {
      console.log('Error: ', error.message);
    })
    .finally(function () {});
}

function locationWeather() {
  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    localStorage.setItem('latitude', latitude);
    localStorage.setItem('longitude', longitude);
    weatherFourDay(`lat=${latitude}&lon=${longitude}`);
    weatherOneDay(`${latitude},${longitude}`);
    localStorage.setItem('search_city', null);
  }

  function error() {
    Notify.warning('Невозможно получить ваше местоположение');
  }

  if (!navigator.geolocation) {
    alert('Geolocation не поддерживается вашим браузером');
  } else {
    weatherDay.innerHTML = 'Определение местоположения…';
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

renderHourDay();

function renderHourDay() {
  if (onRender) {
    weather.innerHTML = weatherHourTest;
  } else {
    weather.innerHTML = weatherDayTest;
  }
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

btnWeatherHour.oninput = function () {
  onRender = true;
  renderHourDay();
};

btnWeatherWeek.oninput = function () {
  onRender = false;
  renderHourDay();
};

weatherDay.addEventListener('keyup', e => {
  if (e.target.id === 'city') {
    city = e.target.value;
    if (e.target.value.length > 2 && e.key == 'Enter') {
      oNwriteCity = true;
      weatherFourDay(`q=${city}`);
      weatherOneDay(city);
    }
  }
});

weatherDay.addEventListener('click', event => {
  if (event.target.value === 'search') {
    oNwriteCity = true;
    weatherFourDay(`q=${city}`);
    weatherOneDay(city);
  }
  if (event.target.value === 'location') {
    locationWeather();
  }
});

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!          Р Е Н Д Е Р         H T M L
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// ?????????????????????????????????????????????????          Погода на 24 часа       ??????????????????????????????

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

// ?????????????????????????????????????????????????          Погода на 1 день        ??????????????????????????????

function weatherD(data) {
  const date = new Date();
  const options2 = {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  };
  const dayAndMonth = date.toLocaleDateString('ru-RU', options2);

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
  } else moonrise24 = moonrise.slice(0, 5);

  if (moonset.slice(6) == 'PM') {
    moonset24 = `${Number(moonset.slice(0, 2)) + 12}:${moonset.slice(3, 5)}`;
  } else moonset24 = moonset.slice(0, 5);

  weatherDay.innerHTML = `
  <style scoped>.progress::after {width: ${humidity}%;}</style>
  <div class="day-list">
    <div class="location">
      <button class="button-location" value="location" type="button">&#128204;</button>
      <div class="inputbox">
        <input required="required" id="city" /><span>${country}, ${city} </span><i></i>
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
          <p title="Количество осадков" class="condition-block-item"><svg width="32" height="32"><use href="${sprite}#icon-umbrella"></use></svg>${precip_mm} мм</p>
          <p  title="Облачность" class="condition-block-item"><svg width="32" height="32"><use href="${sprite}#icon-clouds"></use></svg>${cloud} %</p>
          <p title="Видимость" class="condition-block-item"><svg width="32" height="32"><use href="${sprite}#icon-eye3"></use></svg>${vis_km} км</p>
          <p title="Влажность" class="condition-block-item"><svg width="32" height="32"><use href="${sprite}#icon-raindrop1"></use></svg>${humidity} %</p>
        </div>
      </div>

      <div class="condition-block">
        <img src="//cdn.weatherapi.com/weather/128x128${icon}" widh="128" />
      </div>
    </div>
    <div class="condition-block-bottom">
      <div>
        <p title="Восход солнца" class="condition-block-item"><svg width="32" height="32"><use href="${sprite}#icon-sunrise"></use></svg>${sunrise}</p>
        <p title="Закат солнца" class="condition-block-item"><svg width="32" height="32"><use href="${sprite}#icon-sunset"></use></svg>${sunsetH}:${sunsetM}</p>
         <p title="Восход луны" class="condition-block-item"><svg width="32" height="32"><use href="${sprite}#icon-moonrise"></use></svg>${moonrise24}</p>
        <p title="Закат луны" class="condition-block-item"><svg width="32" height="32"><use href="${sprite}#icon-moonset"></use></svg>${moonset24}</p>
      </div>
      <div>
        <p title="Скорость и направление ветра" class="condition-block-item"><svg width="32" height="32"><use href="${sprite}#icon-air-sock"></use></svg
          >${wind_ms} м/с &#160;<svg width="32" height="32"style="transform: rotate(${wind_degree}deg)"><use href="${sprite}#icon-wind-w"></use></svg></p>
        <p title="Ультрофиолет" class="condition-block-item"><svg width="32" height="32"><use href="${sprite}#icon-sun"></use></svg>${uv}/10 UV</p>
        <p title="Порывы ветра" class="condition-block-item"><svg width="32" height="32"><use href="${sprite}#icon-wind"></use></svg>${maxwind_ms} м/с</p>
        <p title="Давление" class="condition-block-item"><svg width="32" height="32"><use href="${sprite}#icon-barometer"></use></svg>${pressure_mb}мм</p>
      </div>
    </div>
    <p class="update-time">Последнее обновление: ${last_updated}</p>
  </div>`;
}

// ?????????????????????????????????????????????????          Погода на 4 дня         ??????????????????????????????

function fourDayWeather(data) {
  const arr = [[], [], [], []];
  for (let n = 0; n < 4; n++) {
    const date = new Date();
    date.setDate(date.getDate() + 1 + n);
    const day = date.getDate();
    const dayWeekday = date.toLocaleDateString('ru-RU', { weekday: 'long' });
    const dayMonthDay = date.toLocaleDateString('ru-RU', {
      month: 'long',
      day: 'numeric',
    });
    data.list.map(i => {
      if (Number(i.dt_txt.slice(8, 10)) === day) {
        arr[n].push({
          hour: i,
          day: { dayWeekday, dayMonthDay },
        });
      }
    });
  }
  console.log(arr);
  weatherFourDayRender(arr);
}

function weatherFourDayRender(data) {
  const weekOne = data
    .map(i => {
      const dayWeekday = i[0].day.dayWeekday;
      const dayMonthDay = i[0].day.dayMonthDay;
      const dayOne = i
        .map(ii => {
          let k = ii.hour;
          const {
            time = k.dt_txt.slice(11, 16), //* Время
            cloud = k.clouds.all, //* Облачность
            feels_like = (k.main.feels_like - 273.15).toFixed(1), //* Температура. Этот температурный параметр определяет человеческое восприятие погоды. Единица измерения по умолчанию: Кельвин
            grnd_level = k.main.grnd_level, //* Атмосферное давление на уровне земли, гПа
            humidity = k.main.humidity, //* Влажность, %
            pressure = k.main.pressure, //* Атмосферное давление (на уровне моря, если нет данных sea_level или grnd_level), гПа
            sea_level = k.main.sea_level, //* Атмосферное давление на уровне моря, гПа
            temp = (k.main.temp - 273.15).toFixed(1), //* Температура. Единица по умолчанию: Кельвин, Метрическая система: Цельсий, Имперская система: Фаренгейт.
            visibility_km = k.visibility / 1000, //* Видимость, метр. Максимальное значение видимости 10км
            description = k.weather[0].description, //* Погодные условия в группе. Вы можете получить вывод на своем языке
            icon = k.weather[0].icon, //* Идентификатор значка погоды
            deg = k.wind.deg, //* Направление ветра, градусы (метеорологические)
            gust = k.wind.gust, //* Порывы ветра. Единица измерения по умолчанию: метр/сек,
            speed = k.wind.speed, //* Скорость ветра. Единица измерения по умолчанию: метр/сек
          } = k;

          return `
        <div class="day-hour">
          <div class="day-hour__item day-hour__item-time"><p>${time}</p></div>
          <div class="day-hour__item day-hour__item-img"><img title="${description}" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="#" width="100"/></div>
          <div class="day-hour__item day-hour__item-icon-text"><p>${cloud} %</p></div>
          <div class="day-hour__item day-hour__item-icon-text"><p>${temp}°</p></div>
          <div class="day-hour__item day-hour__item-icon-text mobile"><p>${feels_like}°</p></div>
          <div class="day-hour__item day-hour__item-icon-text"><p>${grnd_level}</p></div>
          <div class="day-hour__item day-hour__item-icon-text"><p>${humidity} %</p></div>
          <div class="day-hour__item day-hour__item-icon-text mobile"><p>${visibility_km} км</p></div>
          <div class="day-hour__item day-hour__item-icon-text mobile"><p>${gust}</p></div>
          <div class="day-hour__item day-hour__item-icon-text"><p>${speed}</p></div> 
          <div class="day-hour__item  day-hour__item-icon-text"><svg width="32" height="32" style="transform: rotate(${deg}deg)"><use href="${sprite}#icon-wind-w"></use></svg>
          </div>     
        </div>
      `;
        })
        .join('');
      return (
        `<div class="card-day"><div><div class="card-day__name-day"><h3>${dayWeekday}</h3>
        <h3>${dayMonthDay}</h3></div>
        </div><div class="block-hour">
        
        <div class="day-hour day-hour-name">
          <div class="day-hour__item"><!-- <p>Время:</p> --></div>
          <div class="day-hour__item day-hour__item-img"><!-- <p>img</p> --></div>
          <div title="Облачность" class="day-hour__item day-hour__item-icon-text day-hour__name"><svg width="32" height="32"><use href="${sprite}#icon-clouds"></use></svg></div>
          <div title="Температура" class="day-hour__item day-hour__item-icon-text day-hour__name"><svg width="32" height="32"><use href="${sprite}#icon-thermometer"></use></svg></div>
          <div title="Температура ощущения" class="day-hour__item day-hour__item-icon-text day-hour__name mobile"><svg width="32" height="32"><use href="${sprite}#icon-temperature-feels-like"></use></svg></div>
          <div title="Давление" class="day-hour__item day-hour__item-icon-text day-hour__name"><svg width="32" height="32"><use href="${sprite}#icon-barometer"></use></svg></div>
          <div title="Влажность" class="day-hour__item day-hour__item-icon-text day-hour__name"><svg width="32" height="32"><use href="${sprite}#icon-raindrop1"></use></svg></div>
          <div title="Видимость" class="day-hour__item  day-hour__item-icon-text day-hour__name mobile"><svg width="32" height="32"><use href="${sprite}#icon-eye3"></use></svg></div>
          <div title="Порывы ветра" class="day-hour__item day-hour__item-icon-text day-hour__name mobile"><svg width="32" height="32"><use href="${sprite}#icon-wind"></use></svg></div>
          <div title="Скорость ветра" class="day-hour__item day-hour__item-icon-text day-hour__name mobile2"><svg width="32" height="32"><use href="${sprite}#icon-air-sock"></use></svg></div>    
          <div title="Направление ветра" class="day-hour__item day-hour__item-icon-text day-hour__name mobile"><svg width="32" height="32"><use href="${sprite}#icon-compass2"></use></svg></div>  
        </div>
        ` +
        dayOne +
        '</div></div> '
      );
    })
    .join('');
  weatherDayTest = '<div class="card-week">' + weekOne + '</div>';
}
window.matchMedia('(min-width: 1600px)').addEventListener('change', e => {
  if (!e.matches) {
    Report.failure(
      'Ваша ширина экрана менее 1600px',
      'Для отображения всего контенты измените разрешение экрана, или масштаб страницы'
    );
  }
  return;
});
screenWidth();
function screenWidth() {
  const screenWidth = window.innerWidth;
  if (screenWidth < 420) {
    return;
  } else if (screenWidth < 1600) {
    Report.failure(
      'Ваша ширина экрана менее 1600px',
      'Для отображения всего контенты измените разрешение экрана, или масштаб страницы'
    );
  }
}
