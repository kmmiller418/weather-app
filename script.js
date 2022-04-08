const submit = document.querySelector(".getForecast");

submit.addEventListener("click", () => {
  const zipcode = document.querySelector("#zipcode").value;
  const countryCode = document.querySelector("#countryCode").value;

  if (zipcode == "" || countryCode == "") {
      alert("please enter a location")
      return null;
  }

  getWeather(zipcode, countryCode);
});

//functions
const getWeather = (zipcode, countryCode) => {
  fetch(
    `http://api.openweathermap.org/geo/1.0/zip?zip=${zipcode},${countryCode}&appid=1eba33578583cc2cb757872032783084`
  )
    .then((response) => response.json())
    .then((json) => {
      const { lat, lon, name } = json;
      postLocation(json.name);
      return { lat, lon, name };
    })
    .then((coordinates) => {
      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=hourly&appid=1eba33578583cc2cb757872032783084&units=imperial`
      )
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
            postForecast(json);
            post3DayForecast(json);
        });
    });
};

postLocation = (city) => {
  const location = document.querySelector(".location");
  location.innerHTML = `Thanks for checking in from ${city}.`;
};

postForecast = (json) => {
  const weatherBox = document.querySelector(".weather-box");
  weatherBox.innerHTML = `<h3>Your forecast for today is:</h3>`;

  let currentDate = document.createElement("p");
  let city = document.createElement("p");
  let temp = document.createElement("P");
  let currentConditions = document.createElement("p");
  let tempHi = document.createElement("p");
  let tempLo = document.createElement("p");
  let feelsLike = document.createElement("p");

  currentDate.innerHTML = `It is ${new Date()}`;
  city.innerHTML = `Timezone: ${json.timezone}`;
  temp.innerHTML = `Current temperature: ${json.current.temp} &#176F`;
  currentConditions.innerHTML = `Currently the forecast is: ${json.current.weather[0].main}, with ${json.current.weather[0].description}`;
  tempHi.innerHTML = `The high today is ${json.daily[0].temp.max} &#176F`;
  tempLo.innerHTML = `The low today is ${json.daily[0].temp.min} &#176F`;
  feelsLike.innerHTML = `During the day, it will feel around ${json.daily[0].feels_like.day} &#176F`;

  weatherBox.append(
    currentDate,
    city,
    temp,
    currentConditions,
    tempHi,
    tempLo,
    feelsLike
  );
};

post3DayForecast = (json) => {
    const futureForecast = document.querySelector(".future-forecast");
    futureForecast.innerHTML = `<h3>Your three day forecast is:</h3>`;

    for (i = 1; i < 4; i++) {
        let hi = document.createElement("p");
        let lo = document.createElement("p");
        let condition = document.createElement("p");
        let img = document.createElement("img");
      
        hi.innerHTML = `Day ${i} High: ${json.daily[i].temp.max} &#176F`;
        lo.innerHTML = `Day ${i} Low: ${json.daily[i].temp.min} &#176F`;
        condition.innerHTML = `The forecast calls for ${json.daily[i].weather[0].description}`;
        img.src = `http://openweathermap.org/img/wn/${json.daily[i].weather[0].icon}@2x.png`
        futureForecast.append(img, hi, lo, condition);
    }
  
    futureForecast.style.border = "2px solid black";
}