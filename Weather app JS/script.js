const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const weatherCardsDiv = document.querySelector(".weather-cards");
const currentWeatherDiv = document.querySelector(".current-weather")
const locationButton = document.querySelector(".location-btn")

const API_KEY = "60a66359690970cd855b0f92e45fbae3"; //api key openWeatherMap api

const createWeatherCard = (cityName,weatherItem,index) =>{
    if(index ===0 ){
        return `<div class="details">
        <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
        <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
        <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
        <h6>Humidity: ${weatherItem.main.humidity}%</h6>
    </div>
    <div class="icon">
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
        <h6>${weatherItem.weather[0].description}</h6>
    </div>`;
    }else{
        return `<li class="card">
    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
    <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
</li>`;
}
    
}

const getWeatherDetails = (cityName,lat,lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    

    fetch(WEATHER_API_URL).then(res => res.json()).then(data =>{
        console.log(data);
        //filter the forecasts to get only one forecast per day
        const uniqueForecastDays=[];
        const fivedaysForecast = data.list.filter(forecast=>{
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate)
            }
        });

        cityInput.value = "";
        weatherCardsDiv.innerHTML= "";
        currentWeatherDiv.innerHTML = "";


        console.log(fivedaysForecast);
        fivedaysForecast.forEach((weatherItem,index) =>{
            if(index === 0){
                currentWeatherDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName,weatherItem,index));
            }else{
                weatherCardsDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName,weatherItem,index));
        }    
        })

    }).catch(()=>{
        alert("ERROR cant fetch coordinates")
    });
}

const getCityCoordinates= ()=>{
    const cityName = cityInput.value.trim();// get user entered city name and remove extra spaces
    if(!cityName) return // if city name is empty
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    // Get entered city coordinates(latitude, longitude, name) from API response
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data=>{
        // console.log(data);
        if(!data.length) return alert(`No coordinates found for ${cityName}`);
        const {name,lat,lon} = data[0]
        getWeatherDetails(name,lat,lon);
    })
}

const getUserCoordinates = () =>{
    navigator.geolocation.getCurrentPosition(
        position =>{
            const {latitude,longitude} = position.coords;
            const REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data=>{
                const {name} = data[0];
                getWeatherDetails(name, latitude, longitude)
            }).catch(()=>{
                alert('Error fetching')
            })
    },
    error => {
        if(error.code === error.PERMISSION_DENIED){
            alert("Request Denied")
        };
    }
)
}

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener('click', getCityCoordinates);
cityInput.addEventListener('keyup',e => e.key === "Enter" && getCityCoordinates());