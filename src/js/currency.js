import sprite from '../images/sprite.svg';
import axios from 'axios';
import { Block } from 'notiflix/build/notiflix-block-aio';

const currencyUsd = document.querySelector('#currency-usd');
const currencyEur = document.querySelector('#currency-eur');
const openModalBtn = document.querySelector('[data-modal-open-2-eur]');
const openModalBtn2 = document.querySelector('[data-modal-open-2-usd]');
const closeModalBtn = document.querySelector('[data-modal-close-2]');
const modal = document.querySelector('[data-modal-2]');
const dataInput_1 = document.querySelector('[data-input-1]');
const dataInput_2 = document.querySelector('[data-input-2');
const selected = document.querySelector('#selected');
const selected2 = document.querySelector('#selected2');
const expand = document.querySelector('#expand');
const icon_currency_1 = document.querySelector('.icon-currency-1');
const icon_currency_2 = document.querySelector('.icon-currency-2');
const buy = document.querySelector('#radio-1');
const sell = document.querySelector('#radio-2');
const btnConverter = document.querySelector('#radio-1-cc');
const btnCurrency = document.querySelector('#radio-2-cc');
const table = document.querySelector('#table');
const converterHidden = document.querySelector('[js-converter-hidden]');

Block.init({
  backgroundColor: 'rgba(0,0,0,0.0)',
  svgColor: 'coral',
  messageMaxLength: 19,
});

currencyMono();

function currencyMono() {
  axios
    .request('https://api.monobank.ua/bank/currency')
    .then(function (response) {
      currencyA(response.data);
    })
    .catch(function (error) {
      currencyA('error');
      console.log('Error: ', error.message);
    })
    .finally(function () {});
}

setInterval(currencyMono, 3600000);
currencyUsd.innerHTML = `<div class="js-spinner js-loading"></div>`;
currencyEur.innerHTML = `<div class="js-spinner js-loading"></div>`;
Block.pulse('.js-loading');

// currencyEur.innerHTML = `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`;
let timeout = 5000;

function currencyA(data) {
  if (data == 'error') {
    timeout = timeout + 1000;
    setTimeout(currencyMono, timeout);
    return;
  }

  let arr = [];
  data.map(i => {
    if (i.currencyCodeB == 980) {
      arr.push(i);
    }
  });

  const USD = arr.find(el => el.currencyCodeA == 840);
  const PLN = arr.find(el => el.currencyCodeA == 985);
  const EUR = arr.find(el => el.currencyCodeA == 978);
  const RUB = arr.find(el => el.currencyCodeA == 943);

  const eurTOusaSell = EUR.rateSell / USD.rateSell;
  const eurTOusaBuy = EUR.rateBuy / USD.rateBuy;
  const usdTOeurSell = USD.rateSell / EUR.rateSell;
  const usdTOeurBuy = USD.rateBuy / EUR.rateBuy;
  Block.remove('.js-loading');
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  var moment = require('moment');
  let d1 = moment().format('DD-MM-YYYY');
  let d2 = moment().subtract(1, 'days').format('DD-MM-YYYY');

  let arr11 = JSON.parse(localStorage.getItem('storyCurrency'));
  let arr12 = {};
  if (arr11 === null) {
    console.log('init state currency -- "OK"');
    arr12 = {
      [d2]: [
        EUR.rateBuy,
        EUR.rateSell,
        USD.rateBuy,
        USD.rateSell,
        eurTOusaSell,
        eurTOusaBuy,
        usdTOeurSell,
        usdTOeurBuy,
      ],
      [d1]: [
        EUR.rateBuy,
        EUR.rateSell,
        USD.rateBuy,
        USD.rateSell,
        eurTOusaSell,
        eurTOusaBuy,
        usdTOeurSell,
        usdTOeurBuy,
      ],
    };
    localStorage.setItem('storyCurrency', JSON.stringify(arr12));
    arr11 = arr12;
  }
  // console.log(arr11);

  let differentCurrency = [];
  let arrowCurrency = [];
  if (arr11[d2] !== 'undefined') {
    arr12 = {
      [d2]: arr11[d2],
      [d1]: [
        EUR.rateBuy,
        EUR.rateSell,
        USD.rateBuy,
        USD.rateSell,
        eurTOusaSell,
        eurTOusaBuy,
        usdTOeurSell,
        usdTOeurBuy,
      ],
    };
    localStorage.setItem('storyCurrency', JSON.stringify(arr12));

    let b = 0; //переменнная что-бы не выводилось больше одного уведомления при изменении курса
    const c = [0, 0, 0, 0, 0, 0, 0, 0]; // массив хранит текущий курс при изменении перезаписывает

    for (let n = 0; n < 8; n++) {
      const a = (arr12[d1][n] - arr12[d2][n]).toFixed(4);
      differentCurrency[n] = Number(a);
      // !!! Уведомление об изменении курса валют!!!!!!!!!!!!!!!!!
      if (c[n] !== arr12[d2][n]) {
        c[n] = arr12[d2][n];
        // console.log(c);
        b++;
      }

      // if (Number(a) !== 0) {
      //   b++;
      // }

      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      if (a > 0) {
        arrowCurrency[n] = 'up';
      } else if (a < 0) {
        arrowCurrency[n] = 'down';
      } else arrowCurrency[n] = 'undefined';
    }

    if (b !== 0) {
      b = 0;
      // console.log('уведомление');
      // Уведомление об обновлении курса валют
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Hi!', {
            body: 'Курс валют обновлен',
            icon: 'https://tapajyoti-bose.vercel.app/img/logo.png',
          });
        }
      });
    }
  } else {
    arr12 = {
      [d2]: [
        EUR.rateBuy,
        EUR.rateSell,
        USD.rateBuy,
        USD.rateSell,
        eurTOusaSell,
        eurTOusaBuy,
        usdTOeurSell,
        usdTOeurBuy,
      ],
      [d1]: [
        EUR.rateBuy,
        EUR.rateSell,
        USD.rateBuy,
        USD.rateSell,
        eurTOusaSell,
        eurTOusaBuy,
        usdTOeurSell,
        usdTOeurBuy,
      ],
    };
    localStorage.setItem('storyCurrency', JSON.stringify(arr12));
  }

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  currencyUsd.innerHTML = `
  <div class="currency-card"><svg class="icon-USD" width="96" height="72">
          <use href="${sprite}#icon-USD"></use>
        </svg>
    <div class="currency-block">
      <div>
        <p class="currency-text currency-name-muy-sell">покупка</p>
        <p title=${differentCurrency[2]}  class="currency-text">1 $ = ${
    USD.rateBuy
  } ₴ <svg width="18" height="18"><use href="${sprite}#icon-arrow-${
    arrowCurrency[2]
  }"></use>
        </svg></p>
        <p title=${
          differentCurrency[6]
        } class="currency-text">1 $ = ${usdTOeurSell.toFixed(
    4
  )} € <svg width="18" height="18"><use href="${sprite}#icon-arrow-${
    arrowCurrency[6]
  }"></use>
        </svg> </p>
      </div>
      <div>
        <p class="currency-text currency-name-muy-sell">продажа</p>
        <p title=${differentCurrency[3]} class="currency-text">1 $ = ${
    USD.rateSell
  } ₴ <svg  width="18" height="18"><use href="${sprite}#icon-arrow-${
    arrowCurrency[3]
  }"></use>
        </svg></p>
        <p title=${
          differentCurrency[7]
        } class="currency-text">1 $ = ${usdTOeurBuy.toFixed(
    4
  )} € <svg width="18" height="18"><use href="${sprite}#icon-arrow-${
    arrowCurrency[7]
  }"></use>
        </svg></p>
      </div>
    </div>
    <div></div>
  </div>`;

  currencyEur.innerHTML = `
  <div class="currency-card"><svg class="icon-EUR" width="96" height="72">
          <use href="${sprite}#icon-EUR"></use>
        </svg>
    <div class="currency-block">
      <div>
        <p class="currency-text currency-name-muy-sell">покупка</p>
        <p title=${differentCurrency[0]} class="currency-text">1 € = ${
    EUR.rateBuy
  } ₴ <svg  width="18" height="18"><use href="${sprite}#icon-arrow-${
    arrowCurrency[0]
  }"></use>
        </svg></p>
        <p title=${
          differentCurrency[4]
        } class="currency-text">1 € = ${eurTOusaSell.toFixed(
    4
  )} $ <svg width="18" height="18"><use href="${sprite}#icon-arrow-${
    arrowCurrency[4]
  }"></use>
        </svg> </p>
      </div>
      <div>
        <p class="currency-text currency-name-muy-sell">продажа</p>
        <p title=${differentCurrency[1]} class="currency-text">1 €  = ${
    EUR.rateSell
  } ₴<svg  width="18" height="18"><use href="${sprite}#icon-arrow-${
    arrowCurrency[1]
  }"></use>
        </svg></p>
        <p title=${
          differentCurrency[5]
        } class="currency-text">1 €  = ${eurTOusaBuy.toFixed(
    4
  )} $<svg width="18" height="18"><use href="${sprite}#icon-arrow-${
    arrowCurrency[5]
  }"></use>
        </svg></p>
      </div>
    </div>
    <div></div>
  </div>`;

  // !!!!! MODAL OPEN/CLOSED -------------------------------------------------------------------------------

  openModalBtn.addEventListener('click', toggleModal);
  openModalBtn2.addEventListener('click', toggleModal);
  closeModalBtn.addEventListener('click', toggleModal);

  modal.addEventListener('click', e => {
    if (e.target.classList.value === 'backdrop') {
      toggleModal();
    }
  });

  function toggleModal() {
    document.body.classList.toggle('modal-open');
    modal.classList.toggle('is-hidden');
  }

  btnConverter.oninput = function () {
    const data2 = [USD, EUR, PLN];
    table.classList.toggle('is-hidden2');
    converterHidden.classList.toggle('is-hidden3');
    nbu(data2);
  };
  btnCurrency.oninput = function () {
    const data2 = [USD, EUR, PLN];
    table.classList.toggle('is-hidden2');
    converterHidden.classList.toggle('is-hidden3');
    nbu(data2);
  };

  let valueCurB = EUR.rateBuy;
  let valueCurA = 1;

  let inputOn1 = true;
  let inputOn2 = false;
  let expanrOn = false;
  let buyOn = true;
  let sellOn = false;

  const arr1 = ['UAH', 'EUR', 'USD', 'PLN'];
  const arr2 = ['EUR', 'UAH', 'USD', 'PLN'];

  expand.addEventListener('click', expandCurrency);
  function expandCurrency() {
    expanrOn = true;
    inputOn1 = true;
    f11();
  }

  buy.oninput = function () {
    buyOn = true;
    sellOn = false;
    inputOn1 = true;
    f11();
  };

  sell.oninput = function () {
    buyOn = false;
    sellOn = true;
    inputOn1 = true;
    f11();
  };

  selected.oninput = function () {
    inputOn1 = true;
    f11();
  };

  selected2.oninput = function () {
    inputOn1 = true;
    f11();
  };

  dataInput_1.oninput = function () {
    inputOn1 = true;
    f11();
  };

  dataInput_2.oninput = function () {
    inputOn2 = true;
    f11();
  };

  // !!!!!!!!!   РАБОТАЕТ ПРАВИЛЬНО   !!!!!!!!!!!!!!!!!!!!!!!!!!1

  function f11() {
    let a1 = [...arr1];
    let d1 = [...a1.splice(a1.indexOf(selected.value), 1), ...a1];
    const e1 = d1.indexOf(selected2.value);
    d1.splice(e1, 1);

    let a2 = [...arr1];
    let d2 = [...a2.splice(a2.indexOf(selected2.value), 1), ...a2];
    const e2 = d2.indexOf(selected.value);
    d2.splice(e2, 1);

    if (expanrOn) {
      let arr1_1 = [...d1];
      let arr2_1 = [...d2];
      d1 = arr2_1;
      d2 = arr1_1;
      expanrOn = false;
    }

    icon_currency_1.innerHTML = `
          <svg class="icon" width="64" height="48">
            <use href="${sprite}#icon-${d1[0]}"></use>
          </svg>`;

    selected.innerHTML = `
          <option value="${d1[0]}">${d1[0]}</option>
          <option value="${d1[1]}">${d1[1]}</option>
          <option value="${d1[2]}">${d1[2]}</option>`;

    icon_currency_2.innerHTML = `
          <svg class="icon" width="64" height="48">
            <use href="${sprite}#icon-${d2[0]}"></use>
          </svg>`;

    selected2.innerHTML = `
          <option value="${d2[0]}">${d2[0]}</option>
          <option value="${d2[1]}">${d2[1]}</option>
          <option value="${d2[2]}">${d2[2]}</option>`;

    if (selected.value === 'EUR') {
      if (buyOn) {
        valueCurA = EUR.rateBuy;
      } else if (sellOn) {
        valueCurA = EUR.rateSell;
      }
    } else if (selected.value === 'USD') {
      if (buyOn) {
        valueCurA = USD.rateBuy;
      } else if (sellOn) {
        valueCurA = USD.rateSell;
      }
    } else if (selected.value === 'PLN') {
      valueCurA = PLN.rateCross;
    } else if (selected.value === 'UAH') {
      valueCurA = 1;
    }

    if (selected2.value === 'UAH') {
      valueCurB = 1;
    } else if (selected2.value === 'USD') {
      if (buyOn) {
        valueCurB = USD.rateBuy;
      } else if (sellOn) {
        valueCurB = USD.rateSell;
      }
    } else if (selected2.value === 'PLN') {
      valueCurB = PLN.rateCross;
    } else if (selected2.value === 'EUR') {
      if (buyOn) {
        valueCurB = EUR.rateBuy;
      } else if (sellOn) {
        valueCurB = EUR.rateSell;
      }
    }

    converterCurrency();
  }

  function converterCurrency() {
    let eee1 = dataInput_1.value.trim() * (valueCurA / valueCurB);
    let eee2 = dataInput_2.value.trim() * (valueCurB / valueCurA);

    if (inputOn1) {
      dataInput_2.value = eee1.toFixed(2);
      inputOn1 = false;
    } else if (inputOn2) {
      dataInput_1.value = eee2.toFixed(2);
      inputOn2 = false;
    }
  }
  f11();
}
// *********************************************************************************
const date = new Date();
const dateSearch = date.toISOString().split('T')[0].split('-').join('');

var moment = require('moment');
const dateSearchTomorrow = moment().add(1, 'days').format('YYYYMMDD');
const dateSearchTomorrowTable = moment().add(1, 'days').format('DD-MM');

let dataNBU = [];
let dataNBU2 = [];
axios
  .request(
    `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${dateSearch}&json`,
    { referrerPolicy: 'origin-when-cross-origin' }
  )

  .then(function (response) {
    dataNBU = response.data;
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {});

axios
  .request(
    `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${dateSearchTomorrow}&json`,
    { referrerPolicy: 'origin-when-cross-origin' }
  )

  .then(function (response) {
    dataNBU2 = response.data;
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {});

// !!!! Запрос на международные резарвы на 2 месяца
const dateSearchM = moment().add(-1, 'month').format('YYYYMM');
console.log(dateSearchM);
const dateSearchmNext = moment().add(0, 'month').format('YYYYMM');
axios
  .request(
    `https://bank.gov.ua/NBUStatService/v1/statdirectory/res?date=${dateSearchM}&json`,
    { referrerPolicy: 'origin-when-cross-origin' }
  )

  .then(function (response) {
    const data_a = [];
    response.data.map(i => {
      data_a.push({
        data2: i.dt,
        name: i.txt,
        val: i.value,
      });
    });

    console.table(data_a);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {});
axios
  .request(
    `https://bank.gov.ua/NBUStatService/v1/statdirectory/res?date=${dateSearchmNext}&json`,
    { referrerPolicy: 'origin-when-cross-origin' }
  )

  .then(function (response) {
    const data_a = [];
    response.data.map(i => {
      data_a.push({
        data2: i.dt,
        name: i.txt,
        val: i.value,
      });
    });

    console.table(data_a);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {});
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function nbu(data2) {
  const data = dataNBU;
  const data_tonorrow = dataNBU2;

  const USD = data.find(el => el.cc == 'USD').rate;
  const EUR = data.find(el => el.cc == 'EUR').rate;
  const PLN = data.find(el => el.cc == 'PLN').rate;

  let USD2 = '---------';
  let EUR2 = '---------';
  let PLN2 = '---------';

  if (data_tonorrow.length !== 0) {
    USD2 = data_tonorrow.find(el => el.cc == 'USD').rate;
    EUR2 = data_tonorrow.find(el => el.cc == 'EUR').rate;
    PLN2 = data_tonorrow.find(el => el.cc == 'PLN').rate;
  }
  console.log('qqqqq', data_tonorrow.length);

  table.innerHTML = `<table>
        <tr>
          <th>Валюта</th>
          <th>Покупка MONO</th>
          <th>Продажа MONO</th>
          <th>Курс НБУ</th>
          <th>Курс НБУ ${dateSearchTomorrowTable}</th>

        </tr>
        <tr>
          <th>USD</th>
          <td>${data2[0].rateBuy}</td>
          <td>${data2[0].rateSell}</td>
          <td>${USD}</td>
          <td>${USD2}</td>
        </tr>
        <tr>
          <th>EUR</th>
          <td>${data2[1].rateBuy}</td>
          <td>${data2[1].rateSell}</td>
          <td>${EUR}</td>
          <td>${EUR2}</td>
        </tr>
        <tr>
          <th>PLZ</th>
          <td>${data2[2].rateBuy}</td>
          <td>${data2[2].rateSell}</td>
          <td>${PLN}</td>
          <td>${PLN2}</td>
        </tr>
        
      </table>`;
}
// let ctx = document.getElementById('myChart').getContext('2d');

// let arr20 = {
//   labels: [
//     '01-07',
//     '30-07',
//     '30-06',
//     '29-06',
//     '28-06',
//     '27-06',
//     '26-06',
//     '25-06',
//   ],
//   data: [
//     40.1852, 39.7738, 39.9238, 40.0225, 40.0042, 40.1006, 40.0006, 40.0006,
//   ],
// };
// var moment = require('moment');
// // let currentDayEvent = moment().format('MM-DD');
// let arr21 = { labels: [], data: [] };
// let p = 0;
// for (let n = 0; n < 7; n++) {
//   let d = moment().subtract(n, 'days').format('DD-MM');
//   let d_q = moment().subtract(n, 'days').format('YYYYMMDD');
//   let d_1 = moment()
//     .subtract(n + 1, 'days')
//     .format('DD-MM');
//   let d_1_q = moment()
//     .subtract(n + 1, 'days')
//     .format('YYYYMMDD');
//   if (arr20.labels[0] === d && n === 0) {
//     console.log(1000);
//     arr21 = [arr20];

//     // return;
//   }
//   if (arr20.labels[0] !== d && n === 0) {
//     console.log(n, 'делаем запрос на дату', d);
//     axios
//       .request(
//         `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${d_q}&json`,
//         { referrerPolicy: 'origin-when-cross-origin' }
//       )
//       .then(function (response) {
//         console.log(response.data.find(el => el.cc == 'EUR').rate);
//         arr21.data[0] = response.data.find(el => el.cc == 'EUR').rate;
//       })
//       .catch(function (error) {
//         console.log(error);
//       })
//       .finally(function () {});
//     arr21.labels[0] = d;
//     // arr21.data[0] = n;
//     p++;
//   }
//   if (arr20.labels[n] === d_1 && n !== 0) {
//     console.log(n, 'добавляем в массив дату', d_1);
//     arr21.labels[n] = d_1;
//     arr21.data[n] = n;
//     p++;
//   } else {
//     if (0 < n < 7) {
//       console.log(n + 1, 'делаем запрос на дату', d_1);
//       f2(d_1_q, n);
//       arr21.labels[n + 1] = d_1;

//       p++;
//     }
//   }
// }

// function f2(d_1_q, n) {
//   axios
//     .request(
//       `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${d_1_q}&json`,
//       { referrerPolicy: 'origin-when-cross-origin' }
//     )
//     .then(function (response) {
//       // console.log(response.data.find(el => el.cc == 'EUR').rate);
//       arr21.data[n + 1] = response.data.find(el => el.cc == 'EUR').rate;
//     })
//     .catch(function (error) {
//       console.log(error);
//     })
//     .finally(function () {
//       renderChart();
//     });
// }

// f1();

// function f1() {
//   console.log(arr21.labels[0]);
// }

// setTimeout(fu, 2000);
// function fu() {
//   new Chart(ctx, {
//     type: 'line', // вернули линейный тип
//     data: {
//       labels: [
//         arr21.labels[6],
//         arr21.labels[5],
//         arr21.labels[4],
//         arr21.labels[3],
//         arr21.labels[2],
//         arr21.labels[1],
//         arr21.labels[0],
//       ],
//       datasets: [
//         {
//           label: 'EUR',
//           data: [
//             arr21.data[6],
//             arr21.data[5],
//             arr21.data[4],
//             arr21.data[3],
//             arr21.data[2],
//             arr21.data[1],
//             arr21.data[0],
//           ],
//           borderColor: 'crimson',
//           borderWidth: 3,
//           backgroundColor: 'crimson',
//           cubicInterpolationMode: 'monotone', // добавили сглаживание углов
//         },
//       ],
//     },
//     options: {},
//   });
// }
