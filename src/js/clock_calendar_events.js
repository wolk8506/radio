// ?????????????????  CLOCK   ????????????????????

const deg = 6;
const hour = document.querySelector('.hour');
const min = document.querySelector('.min');
const sec = document.querySelector('.sec');

const setClock = () => {
  let day = new Date();
  let hh = day.getHours() * 30;
  let mm = day.getMinutes() * deg;
  let ss = day.getSeconds() * deg;

  hour.style.transform = `rotateZ(${hh + mm / 12}deg)`;
  min.style.transform = `rotateZ(${mm}deg)`;
  sec.style.transform = `rotateZ(${ss}deg)`;
};

// first time
setClock();
// Update every 1000 ms
setInterval(setClock, 1000);

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!    C A L E N D A R   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
import eventsJSON from '../data/events.json';
const events = eventsJSON;

const eventRegular = {
  1: { 1: 'Новый Год', 7: 'Рождество Христово' }, //1 января – Новый Год; 7 января – Рождество Христово;
  // '02': { 14: true },
  3: { 8: 'Международный женский день' }, //8 марта – Международный женский день;
  4: { 16: 'Пасха' }, //16 апреля – Пасха;
  5: { 1: 'День труда', 9: 'День Победы' }, // 1 мая – День труда; 9 мая – День Победы;
  6: { 4: 'Троица', 28: 'День Конституции Украины' }, //4 июня – Троица; 28 июня – День Конституции Украины;
  7: { 28: 'День украинской государственности' }, //28 июля – День украинской государственности;
  8: { 24: 'День Независимости Украины' }, //24 августа – День Независимости Украины
  // '9': { '1': true },
  10: { 14: 'День защитника Украины' }, //14 октября – День защитника Украины;
  // '11': { '1': true },
  12: { 25: 'Рождество Христово' }, //25 декабря – Рождество Христово.
};

const date = new Date();
var moment = require('moment');
const bodyDivs = document.querySelectorAll('.calendar__body-day');
const month__btnDn = document.querySelector('.month__btn-dn');
const month__btnUp = document.querySelector('.month__btn-up');
const month__name = document.querySelector('.month__name');
const calendar__event = document.querySelector('.calendar__event');
let month = date.getMonth();
let year = date.getFullYear();

let currentDayEvent = moment().format('MM-DD');
// console.log(now);

month__btnDn.addEventListener('click', monthDn);
month__btnUp.addEventListener('click', monthUp);

function monthDn() {
  month = month - 1;
  renderCarendar();
}

function monthUp() {
  month = month + 1;
  renderCarendar();
}

renderCarendar();

function renderCarendar() {
  for (let n = 0; n < 41; n++) {
    bodyDivs[n].innerText = '';
    bodyDivs[n].classList.remove('calendar__current-day');
    bodyDivs[n].classList.remove('calendar__weekend2');
    bodyDivs[n].title = '';
  }

  const nn = daysInMonth(month + 1, year);
  const j = daysInFerst(month, year) - 1;

  month__name.innerText = monthCurrent(month, year);
  for (let n = 0; n < nn; n++) {
    bodyDivs[n + j].innerText = n + 1;
    let eventRegularWeecends = eventRegular[monthCurrentEvent(month, year)];
    if (eventRegularWeecends) {
      if (eventRegularWeecends[n]) {
        bodyDivs[n - 1 + j].classList.add('calendar__weekend2');
        bodyDivs[n - 1 + j].title = eventRegularWeecends[n];
      }
    }
  }
  if (date.getMonth() === month) {
    bodyDivs[date.getDate() - 1 + j].classList.add('calendar__current-day');
  }
  if (events[currentDayEvent]) {
    const event = events[currentDayEvent]
      .map(i => {
        return `<li>${i}</li>`;
      })
      .join('');

    calendar__event.innerHTML = event;
  } else {
    calendar__event.innerHTML = 'Сегодня событий нет';
  }
}

// получение количества дней в месяце
function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

//   Получение номера дня недели первого дня недели
function daysInFerst(month, year) {
  const date = new Date(year, month, 1);
  if (date.getDay() === 0) {
    return 7;
  } else return date.getDay();
}

//  Получение названия месяца
function monthCurrent(month, year) {
  const date = new Date(year, month, 1);
  return date.toLocaleString('ru', { month: 'long', year: 'numeric' });
}

//  Получение номер месяца
function monthCurrentEvent(month, year) {
  const date = new Date(year, month, 1);
  return date.getMonth() + 1;
}
