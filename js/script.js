console.log("fix-w-1.0.1");
import myJson from "./condition.json" assert { type: "json" };

const weatherDay = document.querySelector("#weather-day");
const weatherWeek = document.querySelector("#weather-week");
const weather = document.querySelector("#weather-hour");
const currencyUsd = document.querySelector("#currency-usd");
const currencyEur = document.querySelector("#currency-eur");
let meLocation = "Kharkiv";

function locationWeather() {
  // const status = document.querySelector("#status");
  // const mapLink = document.querySelector("#map-link");

  // mapLink.href = "";
  // mapLink.textContent = "";

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    meLocation = `${latitude},${longitude}`;
    console.log(meLocation);

    fetchUsers7().then((data) => {
      console.log(data);
      weatherW(data);
      weatherH(data);
      weatherD(data);
    });
    // status.textContent = "";
    // mapLink.href = `https://www.google.com.ua/maps/@${latitude},${longitude},14z?hl=ru&authuser=0&entry=ttu`;
    // mapLink.textContent = `Широта: ${latitude} °, Долгота: ${longitude} °`;
  }

  function error() {
    alert("Невозможно получить ваше местоположение");

    fetchUsers7().then((data) => {
      console.log(data);
      weatherW(data);
      weatherH(data);
      weatherD(data);
    });
  }

  if (!navigator.geolocation) {
    alert("Geolocation не поддерживается вашим браузером");
  } else {
    // alert("Определение местоположения…");
    weatherDay.innerHTML = "Определение местоположения…";
    navigator.geolocation.getCurrentPosition(success, error);
  }
}
locationWeather();

const fetchUsers7 = async () => {
  const response = await fetch(
    // "https://api.weatherapi.com/v1/forecast.json?key=02f4d3b9a4c141c6b73150514232405&q=Kharkiv&days=14"
    `https://api.weatherapi.com/v1/forecast.json?key=02f4d3b9a4c141c6b73150514232405&q=${meLocation}&days=14`,
    { referrerPolicy: "origin-when-cross-origin" }
  );
  const data = await response.json();
  return data;
};

// fetchUsers7().then((data) => {
//   console.log(data);
//   weatherW(data);
//   weatherH(data);
//   weatherD(data);
// });

// const fetchUsers = async () => {
//   const response = await fetch(
//     "https://api.weatherapi.com/v1/current.json?key=02f4d3b9a4c141c6b73150514232405&q=Kharkiv"
//   );
//   const data = await response.json();
//   return data;
// };

// fetchUsers().then((data) => weatherD(data));

function weatherH(data) {
  const hourTwoDays = [];
  data.forecast.forecastday[0].hour.map((i) => {
    let arr = i;
    arr.style = "first-day";
    hourTwoDays.push(arr);
  });
  data.forecast.forecastday[1].hour.map((i) => hourTwoDays.push(i));
  const date = new Date();
  const hourOneDay = hourTwoDays.splice(date.getHours(), 24);

  const hour = hourOneDay
    .map(
      (i) => `
<div class="hour-item">
<p class="${i.style}"><svg class="icon-time" width="24" height="24">
          <use href="./img/sprite.svg#icon-time"></use>
        </svg>${i.time.slice(11)}</p> 
        <p class="hour-item-temp">${i.feelslike_c}°C </p>
      <img src="${i.condition.icon}"></div>
      `
    )
    .join("");

  weather.innerHTML = hour;
}

function weatherW(data) {
  const week = data.forecast.forecastday
    .map((i) => {
      const cond = myJson.find((el) => el.code == i.day.condition.code);
      return `<ul>
        <li class="week-first-item"><p><svg class="icon-calendar" width="20" height="20">
          <use href="./img/sprite.svg#icon-calendar"></use>
        </svg>${i.date}</p><div class="week-humidity"><svg class="icon-humidity" width="24" height="24">
          <use href="./img/sprite.svg#icon-humidity"></use>
        </svg><p>${i.day.avghumidity}%</p></div> </li>
        <li></li>
        <li class="condition-week"> <p>${i.day.avgtemp_c}°C</p><img src='${i.day.condition.icon}'></li>
        <li>${cond.ru}</li>
        
    </ul>`;
    })
    .join("");
  weatherWeek.innerHTML = week;
}

function weatherD(data) {
  const cond = myJson.find((el) => el.code == data.current.condition.code);
  const icon = data.current.condition.icon.slice(34);
  const timeSunsetH = data.forecast.forecastday[0].astro.sunset.slice(0, 2);
  const timeSunsetM = data.forecast.forecastday[0].astro.sunset.slice(3, -3);
  console.log();
  console.log(`${Number(timeSunsetH) + 12}:${timeSunsetM}`);
  console.log(icon);
  weatherDay.innerHTML = `<div class="day">
    <ul class="day-list">
        <li class="location"> <svg class="ico-location" width="18" height="18">
          <use href="./img/sprite.svg#icon-location2"></use>
        </svg>${data.location.country}, ${data.location.name}</li>
        <li>Таймзона: ${data.location.tz_id}</li>
        <li class="condition"><p><span>${
          data.current.feelslike_c
        }°C</span></p> <img src='//cdn.weatherapi.com/weather/128x128${icon}' widh=128 ></li>
        <li>${cond.ru}</li>
        <li class="day-wind"><p>Скорость ветра: <span class="day-num">${(
          data.current.wind_kph / 3.6
        ).toFixed(
          2
        )} м/с</span></p>  <img src="./img/compass.png" width="24" style="transform: rotate(${
    136 + data.current.wind_degree
  }deg);"></li>
        <li>Восход: <span class="day-num">${data.forecast.forecastday[0].astro.sunrise.slice(
          0,
          -3
        )}</span></li>
        <li>Закат: <span class="day-num">${
          Number(timeSunsetH) + 12
        }:${timeSunsetM}</span></li>
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
        </svg><span>Облачность</span></p> <span class="day-num">${
          data.current.cloud
        } %</span> </li>
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

const currency = async () => {
  const response = await fetch("https://api.monobank.ua/bank/currency");
  const data = await response.json();
  return data;
};

function f1() {
  currency()
    .then((data) => {
      currencyA(data);
    })
    .catch((error) => {
      // console.error(error);
      console.log("error load currency");
      currencyA("error");
    });
}
f1();
setInterval(f1, 3600000);
currencyUsd.innerHTML = `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`;
currencyEur.innerHTML = `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`;
let timeout = 5000;
function currencyA(data) {
  if (data == "error") {
    timeout = timeout + 1000;
    setTimeout(f1, timeout);
    return;
  }

  let arr = [];
  data.map((i) => {
    if (i.currencyCodeB == 980) {
      arr.push(i);
    }
  });

  const USD = arr.find((el) => el.currencyCodeA == 840);
  const PLN = arr.find((el) => el.currencyCodeA == 985);
  const EUR = arr.find((el) => el.currencyCodeA == 978);
  const RUB = arr.find((el) => el.currencyCodeA == 943);
  console.log(
    `USD продажа: ${USD.rateBuy} | покупка: ${USD.rateSell} | ставка кросс ${USD.rateCross}`
  );
  console.log(
    `PLN продажа: ${PLN.rateBuy} | покупка: ${PLN.rateSell} | ставка кросс ${PLN.rateCross}`
  );
  console.log(
    `EUR продажа: ${EUR.rateBuy} | покупка: ${EUR.rateSell} | ставка кросс ${EUR.rateCross}`
  );
  console.log(
    `RUB продажа: ${RUB.rateBuy} | покупка: ${RUB.rateSell} | ставка кросс ${RUB.rateCross}`
  );
  const eurTOusaSell = EUR.rateSell / USD.rateSell;
  const eurTOusaBuy = EUR.rateBuy / USD.rateBuy;
  const usdTOeurSell = USD.rateSell / EUR.rateSell;
  const usdTOeurBuy = USD.rateBuy / EUR.rateBuy;

  currencyUsd.innerHTML = `<div class="currency"><img src="./img/usa.png" width="24">
  <div>
  <p class="currencyUsd">1 &#36; покупка: ${USD.rateBuy} ₴ | продажа: ${
    USD.rateSell
  } ₴</p>
  <p class="currencyUsd">1 &#36; покупка: ${usdTOeurSell.toFixed(
    4
  )} &#8364; | продажа: ${usdTOeurBuy.toFixed(4)} &#8364;</p>
  </div>
  </div>`;

  currencyEur.innerHTML = `<div class="currency">
  <img src="./img/eur.png" width="24"><div>
  <div>
    <p class="currencyEur">1 &#8364; покупка: ${EUR.rateBuy} ₴ | продажа: ${
    EUR.rateSell
  } ₴</p>
    <p class="currencyEur">1 &#8364; покупка: ${eurTOusaSell.toFixed(
      4
    )} &#36; | продажа: ${eurTOusaBuy.toFixed(4)} &#36;</p>
    </div>`;
}
setInterval(() => {
  fetchUsers7().then((data) => {
    weatherW(data);
    weatherH(data);
    weatherD(data);
  });
  currency().then((data) => currencyA(data));
}, 600000);

// function geoFindMe() {
//   const status = document.querySelector("#status");
//   const mapLink = document.querySelector("#map-link");

//   mapLink.href = "";
//   mapLink.textContent = "";

//   function success(position) {
//     const latitude = position.coords.latitude;
//     const longitude = position.coords.longitude;

//     status.textContent = "";
//     mapLink.href = `https://www.google.com.ua/maps/@${latitude},${longitude},14z?hl=ru&authuser=0&entry=ttu`;
//     mapLink.textContent = `Широта: ${latitude} °, Долгота: ${longitude} °`;
//   }

//   function error() {
//     status.textContent = "Невозможно получить ваше местоположение";
//   }

//   if (!navigator.geolocation) {
//     status.textContent = "Geolocation не поддерживается вашим браузером";
//   } else {
//     status.textContent = "Определение местоположения…";
//     navigator.geolocation.getCurrentPosition(success, error);
//   }
// }

// document.querySelector("#find-me").addEventListener("click", geoFindMe);
