const submitF = document.querySelector(".getForecastF");
const submitC = document.querySelector(".getForecastC");

submitF.addEventListener("click", (e) => {
  const system = e.target.value;
  const zipcode = document.querySelector("#zipcode").value;
  const countryCode = document.querySelector("#countryCode").value;

  if (zipcode == "" || countryCode == "") {
    alert("please enter a location");
    return null;
  }

  getWeather(zipcode, countryCode, system);
});

submitC.addEventListener("click", (e) => {
  const system = e.target.value;
  const zipcode = document.querySelector("#zipcode").value;
  const countryCode = document.querySelector("#countryCode").value;

  if (zipcode == "" || countryCode == "") {
    alert("please enter a location");
    return null;
  }

  getWeather(zipcode, countryCode, system);
});

//functions
const getWeather = (zipcode, countryCode, system) => {
  fetch(
    `https://api.openweathermap.org/geo/1.0/zip?zip=${zipcode},${countryCode}&appid=1eba33578583cc2cb757872032783084`
  )
    .then((response) => response.json())
    .then((json) => {
      const { lat, lon, name } = json;
      postLocation(json.name);
      return { lat, lon, name };
    })
    .then((coordinates) => {
      const unit = (system === 'f') ? "imperial" : "metric";
      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=hourly&appid=1eba33578583cc2cb757872032783084&units=${unit}`
      )
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          postForecast(json);
          post3DayForecast(json);
        });
    });
};

const postLocation = (city) => {
  const location = document.querySelector(".location");
  location.innerHTML = `Thanks for checking in from ${city}!`;
};

const postForecast = (json) => {
  const weatherBox = document.querySelector(".weather-box");
  weatherBox.innerHTML = `<h3>Your forecast for today</h3>`;

  const { current, daily, alerts } = json;
  const temps = [
    current.temp,
    daily[0].temp.max,
    daily[0].temp.min,
    daily[0].feels_like.day,
  ];

  let currentDate = document.createElement("p");
  let city = document.createElement("p");
  let temp = document.createElement("P");
  let currentConditions = document.createElement("p");
  let tempHi = document.createElement("p");
  let tempLo = document.createElement("p");
  let feelsLike = document.createElement("p");
  let humidity = document.createElement("p");
  let windSpeed = document.createElement("p");
  
  let weatherAlerts = document.createElement("div");
  weatherAlerts.classList.add('weather-alerts');

  currentDate.innerHTML = `Your weather report was generated on ${new Date()}`;
  temp.innerHTML = `Current temperature: <span>${Math.round(
    temps[0]
  )} &#176F</span>`;
  currentConditions.innerHTML = `Currently the forecast is: <span>${current.weather[0].main}, with ${current.weather[0].description}</span>`;
  tempHi.innerHTML = `The high today is <span>${Math.round(
    temps[1]
  )} &#176F</span>`;
  tempLo.innerHTML = `The low today is <span>${Math.round(
    temps[2]
  )} &#176F</span>`;
  feelsLike.innerHTML = `During the day, it will feel around <span>${Math.round(
    temps[3]
  )} &#176F</span>`;
  humidity.innerHTML = `The humidity today is <span>${current.humidity}%</span>`;
  windSpeed.innerHTML = `The wind speed today is <span>${current.wind_speed} mph</span>`


  if (!alerts) {
    weatherAlerts.innerHTML = "<h2>No Weather Alerts Today! Have a good day!</h2>"
  } else {
    let senderName = document.createElement("h4");
    let event = document.createElement("h4");
    let description = document.createElement("p");

    senderName.innerHTML = alerts.sender_name;
    event.innerHTML = alerts.event;
    description.innerHTML = alerts.description;

    weatherAlerts.append(senderName, event, description)
  }

  weatherBox.append(
    currentDate,
    city,
    temp,
    tempHi,
    tempLo,
    feelsLike,
    currentConditions,
    humidity,
    windSpeed,
    weatherAlerts
  );
};

const post3DayForecast = (json) => {
  const futureForecast = document.querySelector(".future-forecast");
  futureForecast.innerHTML = `<h3>Your three day forecast</h3>`;

  for (i = 1; i < 4; i++) {
    let daily = json.daily[i];
    let hiLo = document.createElement("p");
    let condition = document.createElement("p");
    let img = document.createElement("img");

    hiLo.innerHTML = `<span>${Math.round(
      daily.temp.max
    )} &#176F / ${Math.round(
      daily.temp.min
    )} &#176F</span>`;
    condition.innerHTML = `The forecast calls for ${daily.weather[0].description}`;
    img.src = `https://openweathermap.org/img/wn/${daily.weather[0].icon}@2x.png`;
    futureForecast.append(img, hiLo, condition);
  }

  futureForecast.style.border = "2px solid black";
};
