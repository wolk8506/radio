import myJson from "./condition.json" assert { type: "json" };
// console.log(myJson);
// console.log(myJson.find((el) => el.code == 1000));

const weatherDay = document.querySelector("#weather-day");
const weatherWeek = document.querySelector("#weather-week");
const weather = document.querySelector("#weather-hour");
const currencyUsd = document.querySelector("#currency-usd");
const currencyEur = document.querySelector("#currency-eur");

const fetchUsers7 = async () => {
  const response = await fetch(
    "https://api.weatherapi.com/v1/forecast.json?key=02f4d3b9a4c141c6b73150514232405&q=Kharkiv&days=14"
  );
  const data = await response.json();
  return data;
};

fetchUsers7().then((data) => {
  console.log(data);
  weatherW(data);
  weatherH(data);
});

const fetchUsers = async () => {
  const response = await fetch(
    "https://api.weatherapi.com/v1/current.json?key=02f4d3b9a4c141c6b73150514232405&q=Kharkiv"
  );
  const data = await response.json();
  return data;
};

setInterval(() => {
  fetchUsers().then((data) => weatherD(data));
  fetchUsers7().then((data) => {
    weatherW(data);
    weatherH(data);
  });
  // console.log(1);
}, 600000);

fetchUsers().then((data) => weatherD(data));

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
<p class="${i.style}">${i.time.slice(11)}</p> 
        <p class="hour-item-temp"> ${i.feelslike_c} °C </p>
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
      // console.log(cond.ru);
      return `<ul>
        <li>${i.date}</li>
        <li></li>
        <li class="condition-week"> <p>${i.day.avgtemp_c} °C</p><img src='${i.day.condition.icon}'></li>
        <li>${cond.ru}</li>
        <li>Влажность: ${i.day.avghumidity}%</li>
    </ul>`;
    })
    .join("");

  weatherWeek.innerHTML = week;
}

function weatherD(data) {
  const cond = myJson.find((el) => el.code == data.current.condition.code);
  // console.log(cond.ru);
  weatherDay.innerHTML = `<div class="day">
    <ul class="day-list">
        <li class="location">${data.location.country}, ${
    data.location.name
  }</li>
        
        <li>Таймзона: ${data.location.tz_id}</li>
        <li class="condition"><p>+${data.current.temp_c}°C</p> <img src='${
    data.current.condition.icon
  }' widh=64 ></li>
        <li>Погодные условия: ${cond.ru}</li>
        
        
        
        <li>Скорость ветра: ${(data.current.wind_kph / 3.6).toFixed(2)} м/с</li>
        <li>Направление ветра в градусах: ${data.current.wind_degree}°</li>
        <li>Направление ветра в виде компаса с 16 точками: ${
          data.current.wind_dir
        }</li>
        </ul>
        <ul class="card-day-list">
        <li class="card-day">
          <p>УФ-индекс</p>
          <span>${data.current.uv}</span> </li>
        <li class="card-day"> <p>Давление</p> <span>${
          data.current.pressure_mb
        } мм</span> </li>
        <li class="card-day"> <p>Порывы ветра</p>  <span>${(
          data.current.gust_kph / 3.6
        ).toFixed(2)} м/с</span> </li>
        <li class="card-day"> <p>Количество осадков</p> <span>${
          data.current.precip_mm
        } мм</span> </li>
        <li class="card-day"> <p>Влажность</p> <span>${
          data.current.humidity
        } %</span> </li>
        <li class="card-day"><p>Облачность</p> <span>${
          data.current.cloud
        } %</span> </li>
        <li class="card-day"><p>По ощущениям температура</p> <span>${
          data.current.feelslike_c
        }°C</span> </li>
        <li class="card-day"> <p>Видимость</p> <span>${
          data.current.vis_km
        } км</span> </li>
        

    </ul>
    <p class="update-time">Местное время, когда данные в реальном времени были обновлены: ${
      data.current.last_updated
    }</p>
    </div>
    `;
}

const currency = async () => {
  const response = await fetch("https://api.monobank.ua/bank/currency");
  const data = await response.json();
  return data;
};

currency().then((data) => {
  // console.log(data);
  currencyA(data);
});

function currencyA(data) {
  // console.log(data.filter((el) => el.currencyCodeB == 840));
  let arr = [];
  data.map((i) => {
    if (i.currencyCodeB == 980) {
      arr.push(i);
    }
  });

  const USD = arr.find((el) => el.currencyCodeA == 840);
  const PLN = arr.find((el) => el.currencyCodeA == 985);
  const EUR = arr.find((el) => el.currencyCodeA == 978);
  console.log(`USD продажа: ${USD.rateBuy} | покупка: ${USD.rateSell}`);
  console.log(`PLN продажа: ${PLN.rateBuy} | покупка: ${PLN.rateSell}`);
  console.log(`EUR продажа: ${EUR.rateBuy} | покупка: ${EUR.rateSell}`);

  currencyUsd.innerHTML = `<div class="currency"><img src="./img/usa.png" width="24"><p class="currencyUsd">USD продажа: ${USD.rateBuy} | покупка: ${USD.rateSell}</p></div>`;
  currencyEur.innerHTML = `<div class="currency"><img src="./img/eur.png" width="24"><p class="currencyEur">EUR продажа: ${EUR.rateBuy} | покупка: ${EUR.rateSell}</p></div>`;
  // console.log(arr);
}
// UNITED STATES OF AMERICA (THE)	US Dollar	USD	840
// UKRAINE	Hryvnia	UAH	980
// POLAND	Zloty	PLN	985
// EUROPEAN UNION	Euro	EUR	978

currencyCodeA: 840;
currencyCodeB: 980;
date: 1684965674;
rateBuy: 36.65;
rateCross: 0;
rateSell: 37.4406;

[
  {
    cod: 840,
    currencyCod: "USD",
    country: "UNITED STATES OF AMERICA",
    currency: "US Dollar",
  },
  { cod: 980, currencyCod: "UAH", country: "UKRAINE", currency: "Hryvnia" },
  { cod: 985, currencyCod: "PLN", country: "POLAND", currency: "Zloty" },
  { cod: 978, currencyCod: "EUR", country: "EUROPEAN UNION", currency: "Euro" },
];

const googleNews = "308e599cba574c4299ca07f15ee0447d";
const aa =
  "https://newsapi.org/v2/top-headlines?sources=google-news-ru&apiKey=308e599cba574c4299ca07f15ee0447d";
