const APIKey = "feb4f2d7e33865553a2c80b01d7dd193";
const searchBarEl = document.querySelector("#search-text");
const searchBtn = document.querySelector("#searchBtn");
const CityNameEl = document.getElementById("city");
const todaysDateEl = document.getElementById("todays-date");
const forecastIconEl = document.getElementById("forecast-icon");
const currentTempEl = document.getElementById("current-temp");
const WindSpeedEl = document.getElementById("wind-mph");
const humidityEl = document.getElementById("humid");
const uvIndexEl = document.getElementById("uv-number");

function showForecast(event) {
  event.preventDefault();
  let city = searchBarEl.value;
  let queryURL =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    APIKey;
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      //need to use the DOM to manipulate the HTML for CityName, CurrentDate, Icon, Temp, Wind, Humidity, UV Index//
    });
}
searchBtn.addEventListener("click", showForecast);
