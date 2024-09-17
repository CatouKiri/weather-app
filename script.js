// fetch(
//   "https://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=d59fa811fcbc953f690244b81b9f8522"
// )
//   .then(function (response) {
//     // console.log(response.json);
//     return response.json();
//   })
//   .then(function (response) {
//     console.log(response);
//     console.log(`https://openweathermap.org/img/wn/`+response.list[0].weather[0].icon+`@2x.png`)
//   })
//   .catch(function (err) {
//     console.log(err);
//   });

let weatherPng = document.getElementById("weather-png");
let temperatureData = document.getElementById("temperature-data");
let humidityData = document.getElementById("humidity-data");
let windData = document.getElementById("wind-data");

function defaultData() {
  fetch(
    "https://api.openweathermap.org/data/2.5/forecast?q=Bacnotan&appid=d59fa811fcbc953f690244b81b9f8522"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      weatherPng.src = `https://openweathermap.org/img/wn/`+response.list[0].weather[0].icon+`@2x.png`;

    })
    .catch(function (err) {
      console.log(err);
    });
}

defaultData();