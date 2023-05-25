import myJson from "./condition.json" assert { type: "json" };
console.log(myJson);
console.log(myJson.find((el) => el.code == 1000));

const weatherDay = document.querySelector("#weather-day");
const weatherWeek = document.querySelector("#weather-week");
const weather = document.querySelector("#weather-hour");

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
  fetchUsers7().then((data) => weatherW(data));
  // console.log(1);
}, 600000);

fetchUsers().then((data) => weatherD(data));

function weatherH(data) {
  const hour = data.forecast.forecastday[0].hour
    .map(
      (i) => `
<div class="hour-item">
<p>${i.time.slice(11)}</p> 
        <p class="hour-item-temp"> ${i.dewpoint_c} °C </p>
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
        <li class="card-day"> <p>Давление:</p> <span>${
          data.current.pressure_mb
        } мм</span> </li>
        <li class="card-day"> <p>Порывы ветра:</p> <span>${(
          data.current.gust_kph / 3.6
        ).toFixed(2)} м/с</span> </li>
        <li class="card-day"> <p>Количество осадков:</p> <span>${
          data.current.precip_mm
        } мм</span> </li>
        <li class="card-day"> <p>Влажность:</p> <span>${
          data.current.humidity
        } %</span> </li>
        <li class="card-day"><p>Облачность: </p> <span>${
          data.current.cloud
        } %</span> </li>
        <li class="card-day"><p>По ощущениям температура:</p> <span>${
          data.current.feelslike_c
        }°C</span> </li>
        <li class="card-day"> <p>Видимость:</p> <span>${
          data.current.vis_km
        } км</span> </li>
        

    </ul>
    <p class="update-time">Местное время, когда данные в реальном времени были обновлены: ${
      data.current.last_updated
    }</p>
    </div>
    `;
}
