// fetch(
//   "https://api.openweathermap.org/data/2.5/forecast?q=Bacnotan&appid=d59fa811fcbc953f690244b81b9f8522"
// )
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (err) {
//     console.log(err);
//   });

let weatherPng = document.getElementById("weather-png");
let temperatureData = document.getElementById("temperature-data");
let humidityData = document.getElementById("humidity-data");
let windData = document.getElementById("wind-data");
let dayAndTime = document.getElementById("day-and-time");
let weatherClass = document.getElementById("weather-class");
let hourlyForecastWeatherPng = document.querySelectorAll(
  "#hourly-forecast-weather-png"
);
let hourlyTempHour = document.querySelectorAll("#hourly-temp-hour");
let hourlyWindHour = document.querySelectorAll("#hourly-wind-hour");
let hourlyHumidityHour = document.querySelectorAll("#hourly-humidity-hour");
let hourlyTimeHour = document.querySelectorAll("#hourly-time-hour");
let dailyForeCastWeatherPng = document.querySelectorAll(
  "#daily-forecast-weather-png"
);
let dailyForeCastDay = document.querySelectorAll("#daily-forecast-day");
let dailyForeCastButton = document.querySelectorAll("#daily-forecast-button");
let cityDetails = document.getElementById("city-name");
let searchCity = document.getElementById("search");
let searchButton = document.getElementById("search-btn");
let temperatureScale = document.getElementById("temperature-scale");
let currentListIndex;
let toTemp = "celcius";
let toSpeed = "kmph";

// UPDATE DATA
async function weatherApi(cityName) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=d59fa811fcbc953f690244b81b9f8522`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      if (response.cod === "404") {
        alert(response.message);
      }

      cityDetails.textContent = `${response.city.name} ${currentDateAndTime(response.city.timezone)}`;

      weatherPng.src = `https://openweathermap.org/img/wn/${response.list[0].weather[0].icon}@2x.png`;
      temperatureData.textContent = tempConverter(
        toTemp,
        response.list[0].main.temp
      );
      humidityData.textContent = `humidity: ${response.list[0].main.humidity}%`;
      windData.textContent = `wind: ${speedConverter(
        toSpeed,
        response.list[0].wind.speed
      )} km/h`;
      const date = new Date(response.list[0].dt_txt);
      dayAndTime.textContent = `${weekday[date.getDay()]} ${changeTimeFormat(
        response.list[0].dt_txt
      )}`;
      weatherClass.textContent = capitalizeFirstLetter(
        response.list[0].weather[0].description
      );

      hourlyData(0, response);

      let startIndex = weekday.indexOf(weekday[date.getDay()]);
      let length = weekday.length - 1;
      for (let i = 0; i < length; i++) {
        let currentIndex = (startIndex + i) % length;
        dailyForeCastDay[i].textContent = weekday[currentIndex];
      }

      dailyForeCastWeatherPng[0].src = `https://openweathermap.org/img/wn/${response.list[0].weather[0].icon}@2x.png`;
      let a = 1;
      for (let i = 0; i < response.list.length; i++) {
        const date = new Date(response.list[i].dt_txt);
        if (date.getHours() === 0) {
          dailyForeCastWeatherPng[
            a
          ].src = `https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png`;
          a++;
        }
      }

      temperatureScale.onclick = () => {
        changeTemperatureScale(response);
      };

      changeDailyWeather(response);
    })
    .catch(function (err) {
      console.log(err);
    });
}

// UPDATE HOURLY DATA
async function hourlyData(startIndex, response) {
  for (i = 0; i < 8; i++) {
    hourlyForecastWeatherPng[i].src = `https://openweathermap.org/img/wn/${response.list[startIndex].weather[0].icon}@2x.png`;
    hourlyTempHour[i].textContent = `temp: ${tempConverter(toTemp, response.list[startIndex].main.temp)}°`;
    hourlyWindHour[i].textContent = `wind: ${speedConverter(toSpeed, response.list[startIndex].wind.speed)} km/h`;
    hourlyHumidityHour[i].textContent = `humidity: ${response.list[startIndex].main.humidity}%`;
    hourlyTimeHour[i].textContent = `${changeTimeFormat(response.list[startIndex].dt_txt)}`;
    startIndex++;
  }
}

// TEMPERATURE CONVERTER
function tempConverter(to, temp) {
  if (to === "celcius") {
    // FROM KELVIN TO CELCIUS
    return Math.ceil(temp - 273.15);
  } else {
    // FROM KELVIN TO FARENHEIT
    return Math.ceil((temp - 273.15) * 1.8 + 32);
  }
}

// SPEED CONVERTER
function speedConverter(to, speed) {
  if (to === "kmph") {
    // FROM METERS PER SECOND TO KMPH
    return Math.ceil((speed * 3600) / 1000);
  } else {
    // FROM METERS PER SECOND TO MPH
    return Math.ceil(speed * 2.23694);
  }
}

// DATE AND TIME FORAMTER
function currentDateAndTime(timezone) {
  const now = new Date();

  // Convert offset from seconds to milliseconds and adjust the time
  const adjustedTime = new Date(now.getTime() + timezone * 1000);

  // Format the adjusted time
  const optionsDate = { month: 'long', day: 'numeric', year: 'numeric' };
  const optionsTime = { hour: 'numeric', minute: 'numeric', hour12: true };

  const formattedDate = adjustedTime.toLocaleDateString('en-US', optionsDate);
  const formattedTime = adjustedTime.toLocaleTimeString('en-US', optionsTime);

  return `${formattedDate} ${formattedTime}`;
}

// CHANGE TIME FORMAT
function changeTimeFormat(apiDate) {
  let date = new Date(apiDate);
  let hours = date.getHours();
  let newformat = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;

  hours = hours ? hours : 12;

  return `${hours}:00 ${newformat}`;
}

// CAPITALIZE FIRST LETTERS
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// DAILY BUTTON HANDLERS
async function changeDailyWeather(response) {

  let start = 0;

  for (let i = 0; i < response.list.length; i++) {
    if ((changeTimeFormat(response.list[i].dt_txt)) === "12:00 AM") {
      start = i;
      break;
    }
  }

  for (let i = 0; i < dailyForeCastButton.length; i++) {
    if (i === 0 && start === 0) {
      let currentStart = start;
      dailyForeCastButton[i].addEventListener("click", async function () {
        hourlyData(currentStart, response);
        currentListIndex = currentStart;
      });
      start = start + 8;
    } else if (i === 0) {
      dailyForeCastButton[i].addEventListener("click", async function () {
        hourlyData(i, response);
        currentListIndex = i;
      });
    } else if (i === dailyForeCastButton.length - 1) {
      dailyForeCastButton[i].addEventListener("click", async function () {
        hourlyData(32, response);
        currentListIndex = 32;
      });
    } else {
      let currentStart = start;
      dailyForeCastButton[i].addEventListener("click", async function () {
        hourlyData(currentStart, response);
        currentListIndex = currentStart;
      });
      start = start + 8;
    }
  }
}

// SEARCH BUTTON HANDLER
searchButton.addEventListener("click", function () {
  weatherApi(searchCity.value);
});

// SEARCH INPUT ENTER HANDLER
searchCity.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    let inputText = searchCity.value;
    // Cancel the default action, if needed
    event.preventDefault();
    weatherApi(inputText);
  }
});

// SEARCH BUTTON HANDLER
function changeTemperatureScale(response) {

  let listIndex = currentListIndex;

  if(!listIndex) {
    listIndex = 0;
  }

  if(toTemp === "celcius") {
    toTemp = "farenheit";
    toSpeed = "mph";
    temperatureData.textContent = tempConverter(toTemp, response.list[0].main.temp);
    windData.textContent = `wind: ${speedConverter(toSpeed, response.list[0].wind.speed)} mph`;

    for (i = 0; i < 8; i++) {
      hourlyTempHour[i].textContent = `temp: ${tempConverter(toTemp, response.list[listIndex].main.temp)}°`;
      hourlyWindHour[i].textContent = `wind: ${speedConverter(toSpeed, response.list[listIndex].wind.speed)} mph`;
      listIndex++;
    }
  }
  else {
    toTemp = "celcius";
    toSpeed = "kmph";
    temperatureData.textContent = tempConverter(toTemp, response.list[0].main.temp);
    windData.textContent = `wind: ${speedConverter(toSpeed, response.list[0].wind.speed)} km/h`;

    for (i = 0; i < 8; i++) {
      hourlyTempHour[i].textContent = `temp: ${tempConverter(toTemp, response.list[listIndex].main.temp)}°`;
      hourlyWindHour[i].textContent = `wind: ${speedConverter(toSpeed, response.list[listIndex].wind.speed)} kmph`;
      listIndex++;
    }
  }
}

// DEFAULT LOCATION
weatherApi("Bacnotan");
