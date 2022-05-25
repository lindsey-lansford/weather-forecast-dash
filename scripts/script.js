const APIKey = "feb4f2d7e33865553a2c80b01d7dd193";
const searchBarEl = document.querySelector("#search-text");
const searchBtn = document.querySelector("#searchBtn");
const cityDateIconEl = document.getElementById("city-date-icon");
const currentTempEl = document.getElementById("current-temp");
const windSpeedEl = document.getElementById("wind-mph");
const humidityEl = document.getElementById("humid");
const uvIndexEl = document.getElementById("uv-number");

function showForecast(event) {
  event.preventDefault();
  let city = searchBarEl.value;
    let queryURL =
        "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
        console.log(data);
        console.log(data.main.temp)
        console.log(data.name)
        console.log(data.main.humidity)
        let currentDate = moment.unix(data.dt).format("MMMM Do, YYYY");
        console.log(currentDate)
        cityDateIconEl.textContent = data.name + " " + currentDate; 
        console.log(data.weather[0].icon)
        currentTempEl.textContent = "Temp: " + data.main.temp + " °F";
        windSpeedEl.textContent = "Wind: " + data.wind.speed + " Mph"
        humidityEl.textContent = "Humidity: " + data.main.humidity + "%"
    });
}
searchBtn.addEventListener("click", showForecast);
