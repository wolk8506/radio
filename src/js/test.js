var moment = require('moment');
let d1 = moment().format('DD-MM-YYYY');
let d2 = moment().subtract(1, 'days').format('DD-MM-YYYY');

const arr1 = {
  '26-06-2023': [4.26, 25.15, 5.125],
  '24-06-2023': 4.24,
  '23-06-2023': 4.23,
};

let arr2 = {};

if (arr1[d2] !== 'undefined') {
  arr2 = { [d2]: arr1[d2], [d1]: [4.26, 25.15, 5.125] };
}
localStorage.setItem('storyCurrency', JSON.stringify(arr2));

const storyCurrency = JSON.parse(localStorage.getItem('storyCurrency'));

console.log(storyCurrency);
