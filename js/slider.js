console.log("fix-s-1.0.3-del");
const idNews = document.querySelector("#news");
const btnMinus = document.querySelector("#btn-minus");
const btnPlus = document.querySelector("#btn-plus");
const sliderNews = document.querySelector("#slider-news");
let count = 0;
let totalnews = 0;
let dataNews = [];
const APIkey1 = "4be889e7726b4f24b5bf5f5ab9a69c1f"; //borat72807@introace.com
const APIkey2 = "1683087afdaf490aa64b24c15f181360"; //borat72807+a1@introace.com
const APIkey3 = "308e599cba574c4299ca07f15ee0447d"; //w

const news = async () => {
  const date = new Date();
  // let APIkey = "";
  // date.getHours();
  // if (date.getHours() < 8) {
  //   APIkey = APIkey1;
  //   console.log("APIkey1");
  // } else if (date.getHours() < 16) {
  //   APIkey = APIkey2;
  //   console.log("APIkey2");
  // } else {
  //   APIkey = APIkey3;
  //   console.log("APIkey3");
  // }

  const response1 = await fetch(
    `https://newsdata.io/api/1/news?apikey=pub_23621b41ce6e76a43d01c3aee8de2c6346c71&language=ru `
  );
  const data = await response1.json();
  // const response2 = await fetch(
  //   // `https://newsapi.org/v2/top-headlines?sources=google-news-ru&apiKey=${APIkey}`
  //   `https://newsapi.org/v2/top-headlines?sources=google-news-ru&apiKey=1683087afdaf490aa64b24c15f181360`,
  //   { referrer: "http://127.0.0.1:5500/" }
  // );
  // const data2 = await response2.json();
  // const response3 = await fetch(
  //   // `https://newsapi.org/v2/top-headlines?country=ru&apiKey=${APIkey}`
  //   `https://newsapi.org/v2/top-headlines?country=ru&apiKey=1683087afdaf490aa64b24c15f181360`,
  //   { referrer: "http://127.0.0.1:5500/" }
  // );
  // const data3 = await response3.json();
  // let data = [];
  // data = await data.concat(data1.articles);
  // data = await data.concat(data2.articles);
  // data = await data.concat(data3.articles);
  // if (data1.status === "error") {
  //   return "error";
  // }
  return data;
};

news().then((data) => {
  // if (data === "error") {
  //   console.log("привышен лимит запроса новостей");
  //   sliderNews.classList.add("limit-request");
  //   return;
  // }
  // dataNews = data;
  // newsMarkup();
  console.log(data);
});

function newsMarkup() {
  const data = dataNews;
  totalnews = data.length;
  if (count === data.length - 1) {
    count = 0;
  } else count = count + 1;

  // !!!!!!!!!!!Timer
  let nIntervId;

  function startTimer() {
    if (!nIntervId) {
      nIntervId = setInterval(nextSlide, 10000);
    }
  }

  function nextSlide() {
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
    markup();
  });

  btnPlus.addEventListener("click", () => {
    if (count === data.length - 1) {
      count = 0;
    } else count = count + 1;
    stopTimer();
    markup();
  });

  function markup() {
    startTimer();
    const t1 = `<img src="${data[count].urlToImage}" height="250">`;
    const t2 = "";
    idNews.innerHTML = `
    <div class="news-card">
      ${data[count].urlToImage ? t1 : t2}
      <div class="news-card-text">
      <div>
      <h3>${data[count].title}</h3>
        <p>${data[count].description}</p>
        <a class="news-link" href="${data[count].url}" >${
      data[count].source.name
    }</a>
      </div>
        
        <div>
          <p class="publishedAt">Опубликовано ${data[count].publishedAt}</p>
          <p class="totalnews">${count + 1} из ${totalnews}</p>
        </div>
      </div>
    </div>
   `;
  }
  markup();

  // const intervalID = setInterval(() => {}, 10000);
}
