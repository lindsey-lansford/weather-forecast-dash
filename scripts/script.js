const APIKey = "feb4f2d7e33865553a2c80b01d7dd193";
const searchBarEl = document.querySelector("#search-text");
const searchBtn = document.querySelector("#searchBtn");
const cityDateIconEl = document.getElementById("city-date-icon");
const currentTempEl = document.getElementById("current-temp");
const windSpeedEl = document.getElementById("wind-mph");
const humidityEl = document.getElementById("humid");
const fiveDayEl = document.getElementById("fiveday-forecast");
const fiveDayTitleEl = document.getElementById("fiveday-title");
const citySearchList = JSON.parse(localStorage.getItem("cityData")) || [];

function renderCitySearch() {
  for (let i = 0; i < citySearchList.length; i++) {
    let citiesSearched = citySearchList[i];
    addCityBtn(citiesSearched);
  }
}

function addCityBtn(cityName) {
  let pastSearchEl = document.getElementById("past-searched-items");
  let savedCityBtn = document.createElement("button");
  //adding elements under the search bar of the users recently searched cities
  savedCityBtn.classList.add("saved-city-btn");
  savedCityBtn.textContent = cityName;
  pastSearchEl.append(savedCityBtn);
  savedCityBtn.style.textTransform = "capitalize";
  savedCityBtn.setAttribute("value", cityName);
  //displays the cities searched after a browser refresh
  savedCityBtn.addEventListener("click", function () {
    getForecast(this.value);
  });
}

function getForecast(event) {
  event.preventDefault();
  let city = searchBarEl.value;
  //clears the search bar input text
  searchBarEl.value = "";
  //setting key: values in localstorage
//declaring parameters and fetching data from API
let queryURL =
"https://api.openweathermap.org/data/2.5/weather?q=" +
city +
"&appid=" +
APIKey +
"&units=imperial";

fetch(queryURL)
.then(function (response) {
  return response.json();
})
.then(function (data) {
  console.log(data)
  console.log(data.cod)
  if (data.cod === "400") {
    console.log("error")
    alert("Error: Please enter City");
    return
  }
  
  if (citySearchList.indexOf(city) === -1) {
    citySearchList.push(city);
    localStorage.setItem("cityData", JSON.stringify(citySearchList));
    addCityBtn(city);
  }
      let currentDate = moment.unix(data.dt).format("MMMM Do, YYYY");
      let weatherIcon = data.weather[0].icon;
      let weatherImg = document.getElementById("weather-icon");
      //pulling data values for current forecast into elements
      weatherImg.setAttribute(
        "src",
        "https://openweathermap.org/img/wn/" + weatherIcon + ".png"
      );
      weatherImg.style.width = "70px";
      weatherImg.style.height = "70px";
      cityDateIconEl.textContent = data.name + ":" + " " + currentDate;
      currentTempEl.textContent = "Temp: " + data.main.temp + "°F";
      windSpeedEl.textContent = "Wind: " + data.wind.speed + " MPH";
      humidityEl.textContent = "Humidity: " + data.main.humidity + "%";
      //calling function that pulls 5-day forecast when the getForecast function is called
      fiveDayForecast(data.coord.lat, data.coord.lon);
      //clears the div elements when user searches a new city without refreshing the browser
      fiveDayEl.innerHTML = "";
      fiveDayTitleEl.innerHTML = "";
    });
}

function fiveDayForecast(lat, lon) {
  var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${APIKey}&units=imperial&cnt=5`;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //pulling UVI data and adding it to current forecast
      let uvIndexEl = document.getElementById("uv-number");
      let currentUVI = data.current.uvi;
      uvIndexEl.textContent = "UV Index: " + currentUVI;

      if (currentUVI < 3) {
        uvIndexEl.classList.add("low-uv");
      } else if (currentUVI >= 3 && currentUVI < 6) {
        uvIndexEl.classList.add("mod-uv");
      } else {
        uvIndexEl.classList.add("high-uv");
      }

      //creating the 5-day forecast title and adding it to parent div
      let title = document.createElement("h2");
      title.textContent = "5-Day Forecast: ";
      fiveDayTitleEl.appendChild(title);

      //for loop that will run 5x to display the 5-day forecast
      for (let i = 1; i < 6; i++) {
        var boxFiveDay = document.createElement("div");
        var date = document.createElement("h3");
        var icon = document.createElement("img");
        var temp = document.createElement("p");
        var wind = document.createElement("p");
        var humid = document.createElement("p");
        boxFiveDay.id = "daybox";
        icon.id = "five-day-img";
        //adding data values and text to the elements
        date.textContent = moment.unix(data.daily[i].dt).format("ddd. MMMM D");
        icon.src =
          "https://openweathermap.org/img/wn/" +
          data.daily[i].weather[0].icon +
          ".png";
        temp.textContent = "Temp: " + data.daily[i].temp.day + "°F";
        wind.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
        humid.textContent = "Humidity: " + data.daily[i].humidity + "%";
        //adding these elements to the parent elements
        boxFiveDay.appendChild(date);
        boxFiveDay.appendChild(icon);
        boxFiveDay.appendChild(temp);
        boxFiveDay.appendChild(wind);
        boxFiveDay.appendChild(humid);
        fiveDayEl.appendChild(boxFiveDay);
      }
    });
}
//This function will display a list of the cities that the user has previous searched.
renderCitySearch();

//when the user clicks "search"--> everything above displays within the browser.
searchBtn.addEventListener("click", getForecast);
