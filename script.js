// URL (required), options (optional)
fetch('http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=d59fa811fcbc953f690244b81b9f8522')
  .then(function(response) {
    console.log(response);
  })
  .catch(function(err) {
    console.log(err);
  });