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
        <li>${data.location.name}</li>
        <li>temp_c: ${data.current.temp_c}</li>
        <li>condition: ${data.current.condition.text}</li>
    </ul>
    `;
}
weatherF();
