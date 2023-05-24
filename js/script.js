const weather = document.querySelector("#weather");
let w;

const fetchUsers = async () => {
  const response = await fetch(
    "https://api.weatherapi.com/v1/current.json?key=02f4d3b9a4c141c6b73150514232405&q=Kharkiv"
  );
  const data = await response.json();
  return data;
};

fetchUsers().then((data) => weatherF(data));
// fetchUsers().then((data) => (weather.textContent = data.location.name));
// fetchUsers().then((users) => console.log(users));

// weather.textContent = users.location.name;

function weatherF(data) {
  weather.innerHTML = `
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
weatherF();
