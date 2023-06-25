import sprite from '../images/sprite.svg';
let root = document.querySelector(':root');
let button = document.querySelector('#theme-toggle');
const iconMoon = document.querySelector('#icon-moon');
const iconSun = document.querySelector('#icon-sun');
const openModalBtn = document.querySelector('[data-modal-open-settings]');
const closeModalBtn = document.querySelector('[data-modal-close-settings]');
const modal = document.querySelector('[data-modal-settings]');
const settings_1_s = JSON.parse(localStorage.getItem('settings_1_s'));
const settings_2_s = JSON.parse(localStorage.getItem('settings_2_s'));
const settings_3_s = JSON.parse(localStorage.getItem('settings_3_s'));

button.addEventListener('click', () => {
  toggleTheme();
});

if (settings_1_s) {
  // отробатывает при переключении темы
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', e => {
      const newColorScheme = e.matches ? 'dark' : 'light';
      toggleTheme();
    });

  // Отрабатывает при загрузке браузера
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    toggleTheme();
  }
}

if (settings_3_s) {
  if (root.className !== 'dark') {
    // console.log(root.className);
    toggleTheme();
  }
  // toggleTheme();
}

function toggleTheme() {
  root.classList.toggle('dark');
  iconMoon.classList.toggle('is-hidden');
  iconSun.classList.toggle('is-hidden');
  // button.innerHTML = `<svg width="32" height="32"><use href="${sprite}#icon-moonset"></use></svg>`;
}

openModalBtn.addEventListener('click', toggleModal);
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

//settings-1
const settings_1 = document.querySelector('#settings-1');
const settings_2 = document.querySelector('#settings-2');
const settings_3 = document.querySelector('#settings-3');
// const settings_4 = document.querySelector('#settings-4');

settings_1.checked = settings_1_s;
settings_1.addEventListener('change', function () {
  some_var = this.checked;
  localStorage.setItem('settings_1_s', some_var);
});

settings_2.checked = settings_2_s;
settings_2.addEventListener('change', function () {
  some_var = this.checked;
  localStorage.setItem('settings_2_s', some_var);
});

settings_3.checked = settings_3_s;
settings_3.addEventListener('change', function () {
  some_var = this.checked;
  localStorage.setItem('settings_3_s', some_var);
});
