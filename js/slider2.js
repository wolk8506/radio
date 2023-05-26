const idNews = document.querySelector("#news");
const btnMinus = document.querySelector("#btn-minus");
const btnPlus = document.querySelector("#btn-plus");
let count = 0;
let totalnews = 0;
let dataNews = [];

const news = async () => {
  const response = await fetch(
    "https://newsapi.org/v2/everything?q=google%20news&language=ru&apiKey=308e599cba574c4299ca07f15ee0447d"
    // "https://newsapi.org/v2/top-headlines?country=ua&category=business&apiKey=308e599cba574c4299ca07f15ee0447d"
    // "https://newsapi.org/v2/top-headlines?sources=google-news-ru&apiKey=308e599cba574c4299ca07f15ee0447d"
    // "https://newsapi.org/v2/top-headlines?country=ua&apiKey=308e599cba574c4299ca07f15ee0447d"
    // "https://newsapi.org/v2/top-headlines?country=ru&apiKey=308e599cba574c4299ca07f15ee0447d"
  );
  const data = await response.json();
  return data;
};

news().then((data) => {
  dataNews = dataNews.concat(data.articles);
});

const news3 = async () => {
  const response = await fetch(
    "https://newsapi.org/v2/top-headlines?sources=google-news-ru&apiKey=308e599cba574c4299ca07f15ee0447d"
    // "https://newsapi.org/v2/top-headlines?country=ua&apiKey=308e599cba574c4299ca07f15ee0447d"
    // "https://newsapi.org/v2/top-headlines?country=ru&apiKey=308e599cba574c4299ca07f15ee0447d"
  );
  const data = await response.json();
  return data;
};

news3().then((data) => {
  dataNews = dataNews.concat(data.articles);
});

const news2 = async () => {
  const response = await fetch(
    // "https://newsapi.org/v2/top-headlines?sources=google-news-ru&apiKey=308e599cba574c4299ca07f15ee0447d"
    // "https://newsapi.org/v2/top-headlines?country=ua&apiKey=308e599cba574c4299ca07f15ee0447d"
    "https://newsapi.org/v2/top-headlines?country=ru&apiKey=308e599cba574c4299ca07f15ee0447d"
  );
  const data = await response.json();
  return data;
};

news2().then((data) => {
  dataNews = dataNews.concat(data.articles);
  newsMarkup();
});

function newsMarkup() {
  const data = dataNews;
  console.log(data);
  totalnews = data.length;
  if (count === data.length - 1) {
    count = 0;
  } else count = count + 1;

  // !!!!!!!!!!!Timer
  let nIntervId;

  function startTimer() {
    if (!nIntervId) {
      nIntervId = setInterval(flashText, 5000);
    }
  }

  function flashText() {
    console.log(1);
    if (count === data.length - 1) {
      count = 0;
    } else count = count + 1;
    markup();
  }

  function stopTimer() {
    clearInterval(nIntervId);
    nIntervId = null;
  }

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!1

  btnMinus.addEventListener("click", () => {
    if (count === 0) {
      count = data.length - 1;
    } else count = count - 1;
    console.log(count);
    markup();
  });

  btnPlus.addEventListener("click", () => {
    if (count === data.length - 1) {
      count = 0;
    } else count = count + 1;
    console.log(count);
    stopTimer();
    markup();
  });

  function markup() {
    startTimer();
    const t1 = `<img src="${data[count].urlToImage}" height="250">`;
    const t2 = "";
    idNews.innerHTML = `<div class="news-card">
                          ${data[count].urlToImage ? t1 : t2}
                          
                          <div>
                            <h3>${data[count].title}</h3>
                            <p>${data[count].description}</p>
                            <a href="${data[count].url}">${
      data[count].source.name
    }</a>
                            <p>Опубликовано ${data[count].publishedAt}</p>
                            <p>${count + 1} из ${totalnews}</p>
                          </div>

                        </div>

                        `;
  }
  markup();

  // const intervalID = setInterval(() => {}, 10000);
}
