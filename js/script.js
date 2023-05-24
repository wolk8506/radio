import myJson from "./condition.json" assert { type: "json" };
console.log(myJson);
console.log(myJson.find((el) => el.code == 1000));

const weatherDay = document.querySelector("#weather-day");
const weatherWeek = document.querySelector("#weather-week");
const weather = document.querySelector("#weather");

const fetchUsers7 = async () => {
  const response = await fetch(
    "http://api.weatherapi.com/v1/forecast.json?key=02f4d3b9a4c141c6b73150514232405&q=Kharkiv&days=30"
  );
  const data = await response.json();
  return data;
};

fetchUsers7().then((data) => {
  console.log(data);
  weatherW(data);
  // weatherH(data);
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
  console.log(1);
}, 600000);

fetchUsers().then((data) => weatherD(data));

// function weatherH(data) {
//   const hour = data.forecast.forecastday[0].hour
//     .map(
//       (i) => `

//       <p>${i.time} |${i.dewpoint_c} °C |</p>`
//     )
//     .join("");

//   weather.innerHTML = hour;
// }

function weatherW(data) {
  const week = data.forecast.forecastday
    .map((i) => {
      const cond = myJson.find((el) => el.code == i.day.condition.code);
      console.log(cond.ru);
      return `<ul>
        <li>${i.date}</li>
        <li>${i.day.avgtemp_c} °C</li>
        <li> <img src='${i.day.condition.icon}'></li>
        <li>${cond.ru}</li>
        <li>Влажность: ${i.day.avghumidity}%</li>
    </ul>`;
    })
    .join("");

  weatherWeek.innerHTML = week;
}

function weatherD(data) {
  const cond = myJson.find((el) => el.code == data.current.condition.code);
  console.log(cond.ru);
  weatherDay.innerHTML = `
    <ul>
        <li>Страна: ${data.location.country}</li>
        <li>Город: ${data.location.name}</li>
        <li>Таймзона: ${data.location.tz_id}</li>
        <li> <img src='${data.current.condition.icon}'></li>
        <li>Погодные условия: ${cond.ru}</li>
        <li>Температура: ${data.current.temp_c}°C</li>
        
        <li>Местное время, когда данные в реальном времени были обновлены: ${
          data.current.last_updated
        }</li>
        <li>Скорость ветра: ${(data.current.wind_kph / 3.6).toFixed(2)} м/с</li>
        <li>Направление ветра в градусах: ${data.current.wind_degree}°</li>
        <li>Направление ветра в виде компаса с 16 точками: ${
          data.current.wind_dir
        }</li>
        <li>УФ-индекс: ${data.current.uv}</li>
        <li>Давление: ${data.current.pressure_mb} мм</li>
        <li>Порывы ветра: ${(data.current.gust_kph / 3.6).toFixed(2)} м/с</li>
        <li>Количество осадков: ${data.current.precip_mm} мм</li>
        <li>Влажность: ${data.current.humidity} %</li>
        <li>Облачность: ${data.current.cloud} %</li>
        <li>По ощущениям температура: ${data.current.feelslike_c}°C</li>
        <li>Видимость: ${data.current.vis_km} км</li>

    </ul>
    `;
}
