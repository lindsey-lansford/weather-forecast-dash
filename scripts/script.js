const APIKey = "feb4f2d7e33865553a2c80b01d7dd193";
const searchBarEl = document.querySelector("#search-text");
const searchBtn = document.querySelector("#searchBtn");
const cityDateIconEl = document.getElementById("city-date-icon");
const currentTempEl = document.getElementById("current-temp");
const windSpeedEl = document.getElementById("wind-mph");
const humidityEl = document.getElementById("humid");
const uvIndexEl = document.getElementById("uv-number");
const fiveDayEl = document.getElementById("fiveday-forecast");
const fiveDayTitleEl = document.getElementById("fiveday-title");
const citySearchList = JSON.parse(localStorage.getItem("cityData")) || [];

function renderCitySearch() {
  for (let i = 0; i < citySearchList.length; i++) {
    let citiesSearched = citySearchList[i];
    
    let pastSearchEl = document.getElementById("past-searched-items");
    let savedCityBtn = document.createElement("button");
    savedCityBtn.id = "saved-city-btn"
    savedCityBtn.textContent = citiesSearched;
    pastSearchEl.append(savedCityBtn);
    savedCityBtn.style.textTransform = "capitalize";

    savedCityBtn.setAttribute("value", citiesSearched);

    savedCityBtn.addEventListener("click", function () {
      getForecast(this.value);
    })

  }
}

function getForecast(event) {
  event.preventDefault();
  let city = searchBarEl.value;
  //clears the search bar input text
  searchBarEl.value = "";
  //setting key: values in localstorage
  if (citySearchList.indexOf(city) === -1) {
    citySearchList.push(city);
    localStorage.setItem("cityData", JSON.stringify(citySearchList));
  }

    let queryURL ="https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";
  fetch(queryURL)
    .then(function (response) {
      if (response.ok) {
      }
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      let currentDate = moment.unix(data.dt).format("MMMM Do, YYYY");
      let weatherIcon = data.weather[0].icon;
      let weatherImg = document.getElementById("weather-icon");
      weatherImg.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + ".png");
      weatherImg.style.width = "70px";
      weatherImg.style.height = "70px";

      cityDateIconEl.textContent = data.name + ":"  + " " + currentDate;
      currentTempEl.textContent = "Temp: " + data.main.temp + "°F";
      windSpeedEl.textContent = "Wind: " + data.wind.speed + " MPH";
      humidityEl.textContent = "Humidity: " + data.main.humidity + "%";
      
      fiveDayForecast(data.coord.lat, data.coord.lon)

      fiveDayEl.innerHTML = "";
      fiveDayTitleEl.innerHTML = "";

    })
}

function fiveDayForecast(lat, lon) {
      var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${APIKey}&units=imperial&cnt=5`;
      fetch(requestUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          let currentUVI = (data.current.uvi);
          uvIndexEl.textContent = "UV Index: " + currentUVI;

          var title = document.createElement("h2");
          title.textContent = "5-Day Forecast: ";
          fiveDayTitleEl.appendChild(title);
          // currentUVI.style.border = "green" NEED TO MAKE CURRENTUVI LOOK LIKE A BTN//
          for (let i = 1; i < 6; i++) {
            var boxFiveDay = document.createElement("div");
            boxFiveDay.id = "daybox";
            var date = document.createElement("h3");
            date.textContent = moment.unix(data.daily[i].dt).format("ddd. MMMM D");
            boxFiveDay.appendChild(date);
            
            var icon = document.createElement("img");
            icon.id = "five-day-img";
            icon.src = "https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png";
            boxFiveDay.appendChild(icon);

            var temp = document.createElement("p")
            temp.textContent = "Temp: " + data.daily[i].temp.day + "°F";
            boxFiveDay.appendChild(temp)
            var wind = document.createElement("p")
            wind.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
            boxFiveDay.appendChild(wind)
            var humid = document.createElement("p")
            humid.textContent = "Humidity: " + data.daily[i].humidity + "%";
            boxFiveDay.appendChild(humid)
            fiveDayEl.appendChild(boxFiveDay)
          }
      })
}
renderCitySearch();

searchBtn.addEventListener("click", getForecast);



