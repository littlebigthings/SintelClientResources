
let $timer = document.getElementById('timer');
let $days = document.getElementById("days");
let $hours = document.getElementById("hours");
let $minutes = document.getElementById("minutes");
let $seconds = document.getElementById("seconds");
let $dateTime = document.getElementById('date-time').innerHTML;

let countDownDate = new Date(`${$dateTime}`).getTime();

let x = setInterval(function() {
  
  let now = new Date().getTime();

  let distance = countDownDate - now;

  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    days = (days.toLocaleString(undefined,{minimumIntegerDigits: 2}))
    hours = (hours.toLocaleString(undefined,{minimumIntegerDigits: 2}))
    minutes = (minutes.toLocaleString(undefined,{minimumIntegerDigits: 2}))
    seconds = (seconds.toLocaleString(undefined,{minimumIntegerDigits: 2}))

    $days.innerHTML = days ;
    $hours.innerHTML = hours;
    $minutes.innerHTML = minutes;
    $seconds.innerHTML = seconds;
    
  if (distance < 0) {
    clearInterval(x);
    $timer.style.display = "none";
  }
}, 1000);