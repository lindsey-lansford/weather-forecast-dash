const APIKey = "feb4f2d7e33865553a2c80b01d7dd193";
const searchBarEl = document.querySelector("#search-text");
const searchBtn = document.querySelector("#searchBtn");
const cityDateIconEl = document.getElementById("city-date-icon");
const currentTempEl = document.getElementById("current-temp");
const windSpeedEl = document.getElementById("wind-mph");
const humidityEl = document.getElementById("humid");
const uvIndexEl = document.getElementById("uv-number");
const fiveDayEl = document.getElementById("day-box");


function getForecast(event) {
  event.preventDefault();
  let city = searchBarEl.value;
    let queryURL ="https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      let currentUVI 
      var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude={part}&appid=${APIKey}&units=imperial&cnt=5`;
      fetch(requestUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          let objTwo = data
          currentUVI = (objTwo.current.uvi);
          uvIndexEl.textContent = "UV Index: " + currentUVI;
          // currentUVI.style.border = "green" NEED TO MAKE CURRENTUVI LOOK LIKE A BTN//
      })

      let currentDate = moment.unix(data.dt).format("MMMM Do, YYYY");
      let weatherIcon = data.weather[0].icon;
      let weatherImg = document.getElementById("weather-icon");
      weatherImg.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + ".png");
      weatherImg.style.width = "70px";
      weatherImg.style.height = "70px";

      cityDateIconEl.textContent = data.name + " " + currentDate;
      currentTempEl.textContent = "Temp: " + data.main.temp + " °F";
      windSpeedEl.textContent = "Wind: " + data.wind.speed + " Mph";
      humidityEl.textContent = "Humidity: " + data.main.humidity + "%";
      
    })
}
searchBtn.addEventListener("click", getForecast);
//NEED TO PULL IN 5DAY FORECAST & REMOVE THE HTML TEXT
//NEED TO SET LOCAL STORAGE AND GET THE CITY NAMES TO SAVE UNDER THE SEARCH BAR


