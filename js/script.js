console.log("fix-w-1.0.1");
import myJson from "../data/condition.json" assert { type: "json" };
import myJsonCurrency from "../data/currency.json" assert { type: "json" };

const weatherDay = document.querySelector("#weather-day");
const weatherWeek = document.querySelector("#weather-week");
const weather = document.querySelector("#weather-hour");
const currencyUsd = document.querySelector("#currency-usd");
const currencyEur = document.querySelector("#currency-eur");
const openModalBtn = document.querySelector("[data-modal-open-2-eur]");
const openModalBtn2 = document.querySelector("[data-modal-open-2-usd]");
const closeModalBtn = document.querySelector("[data-modal-close-2]");
const modal = document.querySelector("[data-modal-2]");
const dataInput = document.querySelector("[data-input-1]");
const dataInput2 = document.querySelector("[data-input-2]");
const selected = document.querySelector("[selected]");
const selected2 = document.querySelector("[selected2]");
const expand = document.querySelector("#expand");
const icon_currency_1 = document.querySelector(".icon-currency-1");
const icon_currency_2 = document.querySelector(".icon-currency-2");


const option_1_3 = document.querySelector(".option-1-3");
const option_1_4 = document.querySelector(".option-1-4");
const option_2_1 = document.querySelector(".option-2-1");
const option_2_2 = document.querySelector(".option-2-2");
const option_2_3 = document.querySelector(".option-2-3");
const option_2_4 = document.querySelector(".option-2-4");

//data-input-1  selected  option-2-1
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
  // const data =myJsonCurrency
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
  

  const eurTOusaSell = EUR.rateSell / USD.rateSell;
  const eurTOusaBuy = EUR.rateBuy / USD.rateBuy;
  const usdTOeurSell = USD.rateSell / EUR.rateSell;
  const usdTOeurBuy = USD.rateBuy / EUR.rateBuy;

  currencyUsd.innerHTML = `<div class="currency"><svg class="icon-USD" width="96" height="72">
          <use href="./img/sprite.svg#icon-USD"></use>
        </svg>
  <div>
  <p class="currencyUsd">1 &#36; покупка: ${USD.rateBuy} ₴ | продажа: ${
    USD.rateSell
  } ₴</p>
  <p class="currencyUsd">1 &#36; покупка: ${usdTOeurSell.toFixed(
    4
  )} &#8364; | продажа: ${usdTOeurBuy.toFixed(4)} &#8364;</p>
  </div>
  </div>`;

  currencyEur.innerHTML = `<div class="currency"><svg class="icon-EUR" width="96" height="72">
          <use href="./img/sprite.svg#icon-EUR"></use>
        </svg><div>
  <div>
    <p class="currencyEur">1 &#8364; покупка: ${EUR.rateBuy} ₴ | продажа: ${
    EUR.rateSell
  } ₴</p>
    <p class="currencyEur">1 &#8364; покупка: ${eurTOusaSell.toFixed(
      4
    )} &#36; | продажа: ${eurTOusaBuy.toFixed(4)} &#36;</p>
    </div>`;

  // }
  // !!!!! MODAL OPEN/CLOSED

  openModalBtn.addEventListener("click", toggleModal);
  openModalBtn2.addEventListener("click", toggleModal);
  closeModalBtn.addEventListener("click", toggleModal);

  // let toggleTimer = true;
  function toggleModal() {
    document.body.classList.toggle("modal-open");
    modal.classList.toggle("is-hidden");
  }
  let a1 = EUR.rateBuy;
  let b1 = 1;
  function converterCurrency() {
    let eee = dataInput.value.trim() * (a1 / b1);

    dataInput2.innerHTML = `${eee.toFixed(2)}`;
  }

  const arr1 =["UAH","EUR","USD","PLN","RUB"]
  const arr2 =["EUR","UAH","USD","PLN","RUB"]



  expand.addEventListener("click", expandCurrency)
let expanrOn =false
  function expandCurrency(){
    expanrOn =true
    f11()
    // converterCurrency();
    converterCurrency2();
    converterCurrency3();
  }

  function f11(){
    
    let a1 = [...arr1]  
    let d1 = [...a1.splice(a1.indexOf(selected.value) , 1),...a1];   
    const e1 = d1.indexOf(selected2.value) 
    d1.splice(e1, 1)
    console.log("Q7", d1);
    // --------------------
    let a2 = [...arr2]  
    let d2 = [...a2.splice(a2.indexOf(selected2.value) , 1),...a2];   
    const e2 = d2.indexOf(selected.value) 
    d2.splice(e2, 1)
    console.log("K7", d2);

    if(expanrOn){

      let arr1_1 = [...d1]
      let arr2_1 = [...d2]
      d1=arr2_1
      d2=arr1_1
      expanrOn =false
    }
    icon_currency_1.innerHTML = `
          <svg class="icon" width="64" height="48">
            <use href="./img/sprite.svg#icon-${d1[0]}"></use>
          </svg>`
   
    selected.innerHTML = `
          <option value="${d1[0]}">${d1[0]}</option>
          <option value="${d1[1]}">${d1[1]}</option>
          <option value="${d1[2]}">${d1[2]}</option>`

    icon_currency_2.innerHTML = `
          <svg class="icon" width="64" height="48">
            <use href="./img/sprite.svg#icon-${d2[0]}"></use>
          </svg>`

    selected2.innerHTML = `
          <option value="${d2[0]}">${d2[0]}</option>
          <option value="${d2[1]}">${d2[1]}</option>
          <option value="${d2[2]}">${d2[2]}</option>`;

console.log("EUR.rateBuy:",d2[0].rateBuy);


  }
  

  function converterCurrency2() {
    if (selected.value === "EUR") {
      a1 = EUR.rateBuy;
    } else if (selected.value === "USD") {
      a1 = USD.rateBuy;
    } else if (selected.value === "PLN") {
      a1 = PLN.rateCross;
    } else if (selected.value === "UAH") {
      a1 = 1;
    } 
    converterCurrency();
  }
  function converterCurrency3() {
    if (selected2.value === "UAH") {
      b1 = 1;
    } else if (selected2.value === "USD") {
      b1 = USD.rateBuy;
    } else if (selected2.value === "PLN") {
      b1 = PLN.rateCross;
    } else if (selected2.value === "EUR") {
      b1 = EUR.rateBuy;
    } 
    converterCurrency();
  }

  selected.oninput = function () {
    converterCurrency2();
f11()
  
  };

  selected2.oninput = function () {
    converterCurrency3();
  
    f11()
  };

  dataInput.oninput = function () {
    converterCurrency();
  };
  converterCurrency();

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
}
setInterval(() => {
  fetchUsers7().then((data) => {
    weatherW(data);
    weatherH(data);
    weatherD(data);
  });
  currency().then((data) => currencyA(data));
}, 600000);

// const currency2 = async () => {
//   const response = await fetch(
//     "https://kurstoday.com.ua/api/chart?from=2000-01&to=2020-05&exchanger_id=9&currency=usd",
//     {
//       referrerPolicy: "unsafe-url",
//     }
//   );
//   const data = await response.json();
//   return data;
// };

// currency2()
//   .then((data) => currencyObmennik(data))
//   .catch((error) => console.log(error, "error load currency"));

// function currencyObmennik(data) {
//   console.log(data);
