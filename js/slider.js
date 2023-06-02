console.log("fix-s-2.1.0");
const idNews = document.querySelector("#news");
const btnMinus = document.querySelector("#btn-minus");
const btnPlus = document.querySelector("#btn-plus");
const sliderNews = document.querySelector("#slider-news");
const contentModal = document.querySelector("#contentModal");
const openModalBtn = document.querySelector("[data-modal-open-1]");
const closeModalBtn = document.querySelector("[data-modal-close-1]");
const modal = document.querySelector("[data-modal-1]");

// import myJson from "./news.json" assert { type: "json" };

let count = 0;
let totalnews = 0;
let dataNews = []; //let dataNews = [];
// const APIkey1 = "";
// const APIkey2 = "";
// const APIkey3 = "";
idNews.innerHTML = `<div class="spinner-news"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>`;
const news = async () => {
  // const date = new Date();
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
    `https://newsdata.io/api/1/news?apikey=pub_23621b41ce6e76a43d01c3aee8de2c6346c71&country=ru,ua&language=ru&category=technology `
  );
  const data1 = await response1.json();
  const response2 = await fetch(
    `https://newsdata.io/api/1/news?apikey=pub_23621b41ce6e76a43d01c3aee8de2c6346c71&country=ua`
  );
  const data2 = await response2.json();
  const nextPage = data2.nextPage;
  const response3 = await fetch(
    `https://newsdata.io/api/1/news?apikey=pub_23621b41ce6e76a43d01c3aee8de2c6346c71&country=ua&page=${nextPage}`
  );
  const data3 = await response3.json();
  let data = [];
  data = await data.concat(data1.results);
  data = await data.concat(data2.results);
  data = await data.concat(data3.results);
  if (data1.status === "error") {
    return "error";
  }
  return data;
};

news().then((data) => {
  dataNews = data;
  newsMarkup();
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
  // !!!!! MODAL OPEN/CLOSED

  openModalBtn.addEventListener("click", toggleModal);
  closeModalBtn.addEventListener("click", toggleModal);

  let toggleTimer = true;
  function toggleModal() {
    if (toggleTimer) {
      stopTimer();
      toggleTimer = false;
    } else {
      startTimer();
      toggleTimer = true;
    }

    document.body.classList.toggle("modal-open");
    modal.classList.toggle("is-hidden");
  }

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!

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
    const img1 = `<img src="${data[count].image_url}" height="250">`;
    const img2 = "";

    idNews.innerHTML = `
    <div class="news-card">
      ${data[count].image_url ? img1 : img2}
      <div class="news-card-text">
      <div class="news-card-content">
      <h3>${data[count].title}</h3>
        <p>${data[count].description ? data[count].description : ""}</p>
        
      </div>
        
        <div>
          <p class="publishedAt">Опубликовано ${data[count].pubDate}</p>
          <p class="totalnews">${count + 1} из ${totalnews}</p>
        </div>
      </div>
    </div>
   `;

    contentModal.innerHTML = `
    <div class="news-card-modal">
    <h2>${data[count].title}</h2>
      ${data[count].image_url ? img1 : img2}
      <div class="news-card-text">
      <div class="news-card-content-modal">
      
        <p>${
          data[count].content ? data[count].content : data[count].description
        }</p>
        <a class="news-link" href="${
          data[count].link
        }" rel="noopener noreferrer" target="_blank">Источник: ${
      data[count].source_id
    }</a>
      </div>
        
        <div>
          <p class="publishedAt">Опубликовано ${data[count].pubDate}</p>
          
        </div>
      </div>
    </div>
   `;
  }
  markup();

  // const intervalID = setInterval(() => {}, 10000);
}
// ???? MODAL NEWS
// (() => {
// const refs = {
//   openModalBtn: document.querySelector("[data-modal-open-1]"),
//   closeModalBtn: document.querySelector("[data-modal-close-1]"),
//   modal: document.querySelector("[data-modal-1]"),
// };

// refs.openModalBtn.addEventListener("click", toggleModal);
// refs.closeModalBtn.addEventListener("click", toggleModal);

// function toggleModal() {
//   document.body.classList.toggle("modal-open");
//   refs.modal.classList.toggle("is-hidden");
// }
// })();
