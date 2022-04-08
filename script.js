const submit = document.querySelector(".getForecast");

submit.addEventListener("click", (e) => {
    const location = document.querySelector("#location");
    console.log(location.value);
    e.preventDefault()
});


//functions 
