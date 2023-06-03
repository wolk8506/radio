import myJsonCurrency from '../data/currency.json' assert { type: 'json' };

const currencyUsd = document.querySelector('#currency-usd');
const currencyEur = document.querySelector('#currency-eur');
const openModalBtn = document.querySelector('[data-modal-open-2-eur]');
const openModalBtn2 = document.querySelector('[data-modal-open-2-usd]');
const closeModalBtn = document.querySelector('[data-modal-close-2]');
const modal = document.querySelector('[data-modal-2]');
const dataInput_1 = document.querySelector('[data-input-1]');
const dataInput_2 = document.querySelector('[data-input-2');

const selected = document.querySelector('[selected]');
const selected2 = document.querySelector('[selected2]');
const expand = document.querySelector('#expand');
const icon_currency_1 = document.querySelector('.icon-currency-1');
const icon_currency_2 = document.querySelector('.icon-currency-2');

const buy = document.querySelector('#buy');
const sell = document.querySelector('#sell');

const fetchCurrency = async () => {
  const response = await fetch('https://api.monobank.ua/bank/currency');
  const data = await response.json();
  // const data = myJsonCurrency;
  return data;
};

function f1() {
  fetchCurrency()
    .then(data => {
      currencyA(data);
    })
    .catch(error => {
      console.log('error load currency');
      currencyA('error');
    });
}

f1();

setInterval(f1, 3600000);
currencyUsd.innerHTML = `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`;
currencyEur.innerHTML = `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`;
let timeout = 5000;

function currencyA(data) {
  if (data == 'error') {
    timeout = timeout + 1000;
    setTimeout(f1, timeout);
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

  currencyUsd.innerHTML = `<div class="currency"><svg class="icon-USD" width="96" height="72">
          <use href="./img/sprite.svg#icon-USD"></use>
        </svg>
  <div>
  <p class="currency-usd">1 &#36; покупка: ${USD.rateBuy} ₴ | продажа: ${USD.rateSell} ₴</p>
  <p class="currency-usd">1 &#36; покупка: ${usdTOeurSell.toFixed(
    4,
  )} &#8364; | продажа: ${usdTOeurBuy.toFixed(4)} &#8364;</p>
  </div>
  </div>`;

  currencyEur.innerHTML = `<div class="currency"><svg class="icon-EUR" width="96" height="72">
          <use href="./img/sprite.svg#icon-EUR"></use>
        </svg><div>
  <div>
    <p class="currency-eur">1 &#8364; покупка: ${EUR.rateBuy} ₴ | продажа: ${EUR.rateSell} ₴</p>
    <p class="currency-eur">1 &#8364; покупка: ${eurTOusaSell.toFixed(
      4,
    )} &#36; | продажа: ${eurTOusaBuy.toFixed(4)} &#36;</p>
    </div>`;

  // }
  // !!!!! MODAL OPEN/CLOSED -------------------------------------------------------------------------------

  openModalBtn.addEventListener('click', toggleModal);
  openModalBtn2.addEventListener('click', toggleModal);
  closeModalBtn.addEventListener('click', toggleModal);
  document.addEventListener('keyup', e => {
    if (e.key === 'Escape') {
      toggleModal();
    }
  });
  modal.addEventListener('click', e => {
    if (e.target.classList.value === 'backdrop') {
      toggleModal();
    }
  });

  function toggleModal() {
    document.body.classList.toggle('modal-open');
    modal.classList.toggle('is-hidden');
  }

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
    console.log('Q7', d1);
    // --------------------
    let a2 = [...arr2];
    let d2 = [...a2.splice(a2.indexOf(selected2.value), 1), ...a2];
    const e2 = d2.indexOf(selected.value);
    d2.splice(e2, 1);
    console.log('K7', d2);

    if (expanrOn) {
      let arr1_1 = [...d1];
      let arr2_1 = [...d2];
      d1 = arr2_1;
      d2 = arr1_1;
      expanrOn = false;
    }

    icon_currency_1.innerHTML = `
          <svg class="icon" width="64" height="48">
            <use href="./img/sprite.svg#icon-${d1[0]}"></use>
          </svg>`;

    selected.innerHTML = `
          <option value="${d1[0]}">${d1[0]}</option>
          <option value="${d1[1]}">${d1[1]}</option>
          <option value="${d1[2]}">${d1[2]}</option>`;

    icon_currency_2.innerHTML = `
          <svg class="icon" width="64" height="48">
            <use href="./img/sprite.svg#icon-${d2[0]}"></use>
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

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
}

// setInterval(() => {
//   fetchCurrency().then(data => currencyA(data));
// }, 600000);
// const currency2 = async () => {
//   const response = await fetch(
//     "https://kurstoday.com.ua/api/chart?from=2000-01&to=2020-05&exchanger_id=9&currency=usd",
//     {
//       referrerPolicy: "unsafe-url",
//     }
//   );
//   const data = await response.json();
//   return data;
// };

// currency2()
//   .then((data) => currencyObmennik(data))
//   .catch((error) => console.log(error, "error load currency"));

// function currencyObmennik(data) {
//   console.log(data);
