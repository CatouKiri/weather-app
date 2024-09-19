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

let cachedData = null;
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

async function weatherApi(cityName) {
  temp = "kelvin";
  speed = "meter/sec";
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
      console.log(response);
      console.log(response.city.name);
      console.log(currentDateAndTime(response.city.timezone));
      cityDetails.textContent = `${response.city.name} ${currentDateAndTime(response.city.timezone)}`;

      weatherPng.src = `https://openweathermap.org/img/wn/${response.list[0].weather[0].icon}@2x.png`;
      temperatureData.textContent = tempConverter(
        temp,
        response.list[0].main.temp
      );
      humidityData.textContent = `humidity: ${response.list[0].main.humidity}%`;
      windData.textContent = `wind: ${speedConverter(
        speed,
        response.list[0].wind.speed
      )} km/h`;
      const date = new Date(response.list[0].dt_txt);
      dayAndTime.textContent = `${weekday[date.getDay()]} ${changeTimeFormat(
        response.list[0].dt_txt
      )}`;
      weatherClass.textContent = capitalizeFirstLetter(
        response.list[0].weather[0].description
      );

      hourlyData(0, response,  hourlyForecastWeatherPng, hourlyTempHour, hourlyWindHour, hourlyHumidityHour, hourlyTimeHour);

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

      changeDailyWeather(response, hourlyForecastWeatherPng, hourlyTempHour, hourlyWindHour, hourlyHumidityHour, hourlyTimeHour);
    })
    .catch(function (err) {
      console.log(err);
    });
}


// TEMPERATURE CONVERTER
function tempConverter(fr, temp) {
  if (fr === "kelvin") {
    return Math.ceil(temp - 273.15);
  } else if (fr === "celsius") {
    return (9 / 5) * temp + 32;
  } else {
    return ((temp - 32) * 5) / 9;
  }
}

// SPEED CONVERTER
function speedConverter(fr, speed) {
  if (fr === "meter/sec") {
    return Math.ceil((speed * 3600) / 1000);
  } else if (fr === "km/hr") {
    return Math.ceil(speed * 0.62);
  } else {
    return Math.ceil(speed * 1.60934);
  }
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

// BUTTON HANDLERS
async function changeDailyWeather(response, hourlyForecastWeatherPng, hourlyTempHour, hourlyWindHour, hourlyHumidityHour, hourlyTimeHour) {

  let start = 0;

  for(let i = 0; i < response.list.length; i++){
    if((changeTimeFormat(response.list[i].dt_txt)) === "12:00 AM") {
      start = i;
      break;
    }
  }

  for (let i = 0; i < dailyForeCastButton.length; i++) {
    if (i === 0 && start === 0) {
      let currentStart = start;
      dailyForeCastButton[i].addEventListener("click", async function () {
        hourlyData(currentStart, response, hourlyForecastWeatherPng, hourlyTempHour, hourlyWindHour, hourlyHumidityHour, hourlyTimeHour);
      });
      start = start + 8;
    } else if (i === 0) {
      dailyForeCastButton[i].addEventListener("click", async function () {
        hourlyData(i, response, hourlyForecastWeatherPng, hourlyTempHour, hourlyWindHour, hourlyHumidityHour, hourlyTimeHour);
      });
    } else if (i === dailyForeCastButton.length - 1) {
      dailyForeCastButton[i].addEventListener("click", async function () {
        hourlyData(32, response, hourlyForecastWeatherPng, hourlyTempHour, hourlyWindHour, hourlyHumidityHour, hourlyTimeHour);
      });
    } else {
      let currentStart = start;
      dailyForeCastButton[i].addEventListener("click", async function () {
        hourlyData(currentStart, response, hourlyForecastWeatherPng, hourlyTempHour, hourlyWindHour, hourlyHumidityHour, hourlyTimeHour);
      });
      start = start + 8;
    }
  }
}

// UPDATE HOURLY DATA
async function hourlyData(startIndex, response, hourlyForecastWeatherPng, hourlyTempHour, hourlyWindHour, hourlyHumidityHour, hourlyTimeHour) {
  for (i = 0; i < 8; i++) {
    hourlyForecastWeatherPng[i].src = `https://openweathermap.org/img/wn/${response.list[startIndex].weather[0].icon}@2x.png`;
    hourlyTempHour[i].textContent = `temp: ${tempConverter(temp,response.list[startIndex].main.temp)}°`;
    hourlyWindHour[i].textContent = `wind: ${speedConverter(speed, response.list[startIndex].wind.speed)} km/h`;
    hourlyHumidityHour[i].textContent = `humidity: ${response.list[startIndex].main.humidity}%`;
    hourlyTimeHour[i].textContent = `${changeTimeFormat(response.list[startIndex].dt_txt)}`;
    startIndex++;
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

// DEFAULT LOCATION
weatherApi("Tokyo");