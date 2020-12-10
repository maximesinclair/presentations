// Credit: Mateusz Rybczonec

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 40;
const ALERT_THRESHOLD = 10;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

const TIME_LIMIT = 60;
let timeLimit = TIME_LIMIT;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let activeTimer = null;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;
let listOfTimer = document.getElementsByClassName('mr-timer');
let idCounter = new Date().getMilliseconds();

for (var i = 0; i < listOfTimer.length; i++) {
  let currentTimer = listOfTimer[i];
  (currentTimer.id) ? currentTimer.id : (currentTimer.id = 'base-timer-' + idCounter++);
  initTimer(currentTimer);
  currentTimer.onclick = function () {
    startTimer(currentTimer);
  }
}

function initTimer(tim) {
  tim.innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="${tim.id}-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="${tim.id}-label" class="base-timer__label">${formatTime(getTimeLimit(tim))}</span>
</div>
`
}

function getTimeLimit(node) {
  let tL = Number(node.getAttribute('data-timer-duration'));
  return (Number.isInteger(tL)) ? tL * 60 : TIME_LIMIT;
}

function onTimesUp() {
  clearInterval(timerInterval);
  activeTimer = null;
}

function startTimer(t) {
  if (activeTimer != null) {
    console.log('A Timer is already running');
    return;
  }
  activeTimer = t;
  timePassed = 0;
  timeLimit = getTimeLimit(t);
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = timeLimit - timePassed;
    document.getElementById(activeTimer.id + "-label").innerHTML = formatTime(timeLeft);
    setCircleDasharray(activeTimer.id);
    setRemainingPathColor(activeTimer.id, timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timId, timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    let pathClasses =
      document.getElementById(timId + "-path-remaining").classList;
    pathClasses.remove(warning.color);
    pathClasses.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    let pathClasses =
      document.getElementById(timId + "-path-remaining").classList;
    pathClasses.remove(info.color);
    pathClasses.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / timeLimit;
  return rawTimeFraction - (1 / timeLimit) * (1 - rawTimeFraction);
}

function setCircleDasharray(timId) {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById(timId + "-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

