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
  console.log(1);
}, 600000);

fetchUsers().then((data) => weatherD(data));
// fetchUsers().then((data) => (weather.textContent = data.location.name));
// fetchUsers().then((users) => console.log(users));

// weather.textContent = users.location.name;
function weatherH(data) {
  const hour = data.forecast.forecastday[0].hour
    .map(
      (i) => `
      
      <p>${i.time} |${i.dewpoint_c} °C |</p>`
    )
    .join("");
  //   console.log(hour);
  weather.innerHTML = hour;
}

function weatherW(data) {
  const week = data.forecast.forecastday
    .map(
      (i) => `<ul>
        <li>${i.date}</li>
        <li>${i.day.avgtemp_c} °C</li>
        <li> <img src='${i.day.condition.icon}'></li>
        <li>${i.day.condition.text}</li>
        <li>Влажность: ${i.day.avghumidity}%</li>
    </ul>`
    )
    .join("");

  weatherWeek.innerHTML = week;
}
// weatherW();

function weatherD(data) {
  weatherDay.innerHTML = `
    <ul>
        <li>Страна: ${data.location.country}</li>
        <li>Город: ${data.location.name}</li>
        <li>Таймзона: ${data.location.tz_id}</li>
        <li> <img src='${data.current.condition.icon}'></li>
        <li>Погодные условия: ${data.current.condition.text}</li>
        <li>Температура: ${data.current.temp_c}°C</li>
        
        <li>Местное время, когда данные в реальном времени были обновлены: ${data.current.last_updated}</li>
        <li>Скорость ветра в километрах в час: ${data.current.wind_kph}</li>
        <li>Направление ветра в градусах: ${data.current.wind_degree}</li>
        <li>Направление ветра в виде компаса с 16 точками: ${data.current.wind_dir}</li>
        <li>УФ-индекс: ${data.current.uv}</li>
        <li>Давление в миллибарах: ${data.current.gust_kph}</li>
        <li>Порывы ветра в километрах в час: ${data.current.pressure_mb}</li>
        <li>Количество осадков в миллиметрах: ${data.current.precip_mm}</li>
        <li>Влажность в процентах: ${data.current.humidity}</li>
        <li>Облачность в процентах: ${data.current.cloud}</li>
        <li>По ощущениям температура как по Цельсию: ${data.current.feelslike_c}</li>
        <li>Видимость в километре: ${data.current.vis_km}</li>

    </ul>
    `;
}
// weatherF();
