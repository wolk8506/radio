const initialState = JSON.parse(localStorage.getItem('initialState'));
if (initialState === null) {
  localStorage.setItem('startPlayStationNumber', 0);
  localStorage.setItem('initialState', true);
  console.log('initialState -- "OK"');
}

const logo = [
  'https://i.ibb.co/CbKVPLF/img-181-fm.jpg',
  'https://i.ibb.co/HNRLK8M/img-soundpark-deep.jpg',
  'https://i.ibb.co/mCbQ8yk/img-nrg-radio.jpg',
  'https://i.ibb.co/bbPVPN1/img-kiss-fm.jpg',
];
const radioStation = [
  'https://listen.181fm.com/181-rock_128k.mp3',
  'https://getradio.me/spdeep',
  'https://pub0202.101.ru:8443/stream/air/aac/64/99',
  'https://link.smmbox.ru/http://online.kissfm.ua/KissFM_HD',
];
const name = ['Rock 181', 'SOUNDPARK DEEP', 'Радио Energy', 'KissFM_HD'];
const audio = new Audio();
const selectStation = document.querySelector('#select-station');
const imageStation = document.querySelector('#image-station');
const icoPlay = document.querySelector('#ico-play');
const icoPause = document.querySelector('#ico-pause');
const play = document.getElementById('play');
const volume = document.getElementById('volume');
const volume_off = document.querySelector('#volume_off');
const icon_volume_down = document.querySelector('#icon-volume_down');
const icon_volume_off = document.querySelector('#icon-volume_off');
const openModalBtn = document.querySelector('[data-modal-open-radio]');
const closeModalBtn = document.querySelector('[data-modal-close-radio]');
const modal = document.querySelector('[data-modal-radio]');
const inputTimer = document.querySelector('[data-input-radio]');
const startTimer = document.querySelector('#start-timer');
const icoAlarms = document.querySelector('#ico-alarms');
let volumeOnOff = true;
let timer = 0;
let onPlay = true;
let volumeLevel = 80;
let startPlayStationNumber = JSON.parse(
  localStorage.getItem('startPlayStationNumber')
);
let StartPlayStationOnLoad = JSON.parse(
  localStorage.getItem('StartPlayStationOnLoad')
);
let numberStation = startPlayStationNumber;

selectStation.value = startPlayStationNumber;

play.addEventListener('click', startPlay);

function startPlay() {
  if (onPlay) {
    audio.src = radioStation[numberStation];
    audio.play();
    onPlay = false;
    localStorage.setItem('StartPlayStationOnLoad', true);
  } else {
    audio.pause();
    onPlay = true;
    localStorage.setItem('StartPlayStationOnLoad', false);
  }

  icoPlay.classList.toggle('is-hidden');
  icoPause.classList.toggle('is-hidden');

  renderImage(numberStation);
}

renderImage(numberStation);

function renderImage(numberStation) {
  imageStation.innerHTML = `<img
      class="img4"
      src="${logo[numberStation]}"
      alt="sdgzsf"
      width="96"
    />`;
}

selectStation.oninput = function () {
  if (!onPlay) {
    icoPlay.classList.toggle('is-hidden');
    icoPause.classList.toggle('is-hidden');
  }
  onPlay = false;

  numberStation = Number(selectStation.value);
  localStorage.setItem('startPlayStationNumber', selectStation.value);
  renderImage(numberStation);
  audio.pause();
  audio.src = radioStation[selectStation.value];
  audio.play();
  console.log(!onPlay);
  if (!onPlay) {
    icoPlay.classList.toggle('is-hidden');
    icoPause.classList.toggle('is-hidden');
  }
};

volume_off.addEventListener('click', () => {
  icon_volume_down.classList.toggle('is-hidden');
  icon_volume_off.classList.toggle('is-hidden');
  if (volumeOnOff) {
    audio.volume = 0;
    volumeOnOff = false;
  } else {
    if (Number(volumeLevel) < 20) {
      volume.value = 20;
      audio.volume = 0.2;
    } else audio.volume = Number(volumeLevel) / 100;
    volumeOnOff = true;
  }
});

volume.addEventListener(
  'input',
  function () {
    volumeLevel = this.value;
    audio.volume = parseFloat(this.value / 100);
    if (parseFloat(this.value) === 0.0) {
      console.log(this.value === 0);
      icon_volume_down.classList.toggle('is-hidden');
      icon_volume_off.classList.toggle('is-hidden');
      volumeOnOff = false;
    }
    if (!volumeOnOff && parseFloat(this.value) !== 0.0) {
      icon_volume_down.classList.toggle('is-hidden');
      icon_volume_off.classList.toggle('is-hidden');
      volumeOnOff = true;
    }
  },
  false
);

audio.addEventListener(
  'timeupdate',
  function () {
    const duration = document.getElementById('duration');
    let s = parseInt(audio.currentTime % 60);
    let m = parseInt((audio.currentTime / 60) % 60);

    duration.innerHTML = `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  },
  false
);

openModalBtn.addEventListener('click', toggleModalRadio);
closeModalBtn.addEventListener('click', toggleModalRadio);

modal.addEventListener('click', e => {
  if (e.target.classList.value === 'backdrop') {
    toggleModalRadio();
  }
});

function toggleModalRadio() {
  document.body.classList.toggle('modal-open');
  modal.classList.toggle('is-hidden');
}

inputTimer.addEventListener('input', e => {
  let time = e.target.value;
  let h = Number(time.slice(0, 2)) * 60 * 60 * 1000;
  let m = Number(time.slice(3, 5)) * 60 * 1000;
  let timeTimer = h + m;
  timer = timeTimer;
});

startTimer.addEventListener('click', () => {
  const currentTimeStartTimer = Date.now();
  localStorage.setItem('currentTimeStartTimer', currentTimeStartTimer);
  localStorage.setItem('timeDurationTimer', timer);
  timerStopPlay(timer);
});

(function () {
  const currentTimeStartTimer = JSON.parse(
    localStorage.getItem('currentTimeStartTimer')
  );
  const timeDurationTimer = JSON.parse(
    localStorage.getItem('timeDurationTimer')
  );
  const currentTime = Date.now();
  const timeDifference = currentTime - currentTimeStartTimer;
  if (timeDifference > timeDurationTimer) {
    return;
  } else {
    const remainder = timeDurationTimer - timeDifference;
    timerStopPlay(remainder);
  }
})();

function timerStopPlay(timer) {
  let endsAfter = timer;
  icoAlarms.classList.toggle('blink');
  startTimer.disabled = true;
  inputTimer.disabled = true;

  const step = 1000;

  setTimeout(
    () => {
      audio.pause();

      icoAlarms.classList.toggle('blink');
      startTimer.disabled = false;
      inputTimer.disabled = false;
      duration2.innerHTML = '--:--:--';
      if (onPlay) {
        return;
      } else {
        onPlay = true;

        icoPlay.classList.toggle('is-hidden');
        icoPause.classList.toggle('is-hidden');
      }
    },

    timer
  );

  const interval = setInterval(function () {
    endsAfter -= step;
    if (endsAfter <= 0) {
      clearInterval(interval);
    }

    const duration2 = document.getElementById('duration2');

    let s = Math.floor((endsAfter / 1000) % 60);
    let m = Math.floor((endsAfter / (1000 * 60)) % 60);
    let h = Math.floor((endsAfter / (1000 * 60 * 60)) % 24);

    duration2.innerHTML = `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}:${
      s < 10 ? '0' + s : s
    }`;
  }, step);
}
