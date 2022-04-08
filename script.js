const submit = document.querySelector(".getForecast");

submit.addEventListener("click", () => {
    const zipcode = document.querySelector("#zipcode").value;
    const countryCode = document.querySelector("#countryCode").value;
    getWeather(zipcode, countryCode);
});


//functions 
const getWeather = (zipcode, countryCode) => {
    fetch(`http://api.openweathermap.org/geo/1.0/zip?zip=${zipcode},${countryCode}&appid=1eba33578583cc2cb757872032783084`)
    .then((response) => response.json())
    .then((json) => {
        const { lat, lon } = json;
        return { lat, lon };
    }).then((coordinates) => {
        console.log(coordinates.lat);
        console.log(coordinates.lon);
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=1eba33578583cc2cb757872032783084&units=imperial`)
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
            postForecast(json);
        })
    })
};

postForecast = (json) => {
    const weatherBox = document.querySelector(".weather-box");
    weatherBox.innerHTML = "Your forecast for today is:";
    
    let currentDate = document.createElement("p");
    let city = document.createElement("p");
    let temp = document.createElement("P");
    let currentConditions = document.createElement("p");
    let tempHi = document.createElement("p");
    let tempLo = document.createElement("p");
    let feelsLike = document.createElement("p");

    currentDate.innerHTML = `Weather requested at ${json.current.dt}`;
    city.innerHTML = `Timezone: ${json.timezone}`;
    temp.innerHTML = `Current temperature: ${json.current.temp}`;
    currentConditions.innerHTML = `Currently it is: ${json.current.weather[0].main}, with ${json.current.weather[0].description}`;
    tempHi.innerHTML = `The high today is ${json.daily[0].temp.max}`;
    tempLo.innerHTML = `The low today is ${json.daily[0].temp.min}`;
    feelsLike.innerHTML = `During the day, it will feel around ${json.daily[0].feels_like}`;

    weatherBox.append(currentDate, city, temp, currentConditions);
}