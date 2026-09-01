const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const weatherIcon = document.getElementById("weatherIcon");

const unitBtn = document.getElementById("unitBtn");
const forecastContainer = document.getElementById("forecastContainer");
const loading = document.getElementById("loading");

const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const feelsLike = document.getElementById("feelsLike");

let currentTemperatureCelsius = null;
let currentFeelsLikeCelsius = null;
let isCelsius = true;

// ===============================
// DISPLAY WEATHER
// ===============================

function displayWeather(current, daily, city) {


cityName.textContent = city;

// Temperature
currentTemperatureCelsius = current.temperature_2m;

temperature.textContent =
    `${Math.round(currentTemperatureCelsius)}°C`;

isCelsius = true;

unitBtn.textContent = "Switch to °F";


// Humidity
humidity.textContent =
    `${current.relative_humidity_2m}%`;


// Wind
wind.textContent =
    `${Math.round(current.wind_speed_10m)} km/h`;


// Feels Like
currentFeelsLikeCelsius =
    current.apparent_temperature;

feelsLike.textContent =
    `${Math.round(currentFeelsLikeCelsius)}°C`;


// Sunrise & Sunset

if (
    daily &&
    daily.sunrise &&
    daily.sunset
) {

    sunrise.textContent =
        formatTime(daily.sunrise[0]);

    sunset.textContent =
        formatTime(daily.sunset[0]);
}


// Weather condition and icon

const weatherCode =
    current.weather_code;


if (weatherCode === 0) {

    condition.textContent =
        "Clear Sky";

    weatherIcon.textContent =
        "☀️";

} else if (weatherCode <= 3) {

    condition.textContent =
        "Partly Cloudy";

    weatherIcon.textContent =
        "⛅";

} else if (weatherCode <= 48) {

    condition.textContent =
        "Foggy";

    weatherIcon.textContent =
        "🌫️";

} else if (weatherCode <= 67) {

    condition.textContent =
        "Rainy";

    weatherIcon.textContent =
        "🌧️";

} else if (weatherCode <= 77) {

    condition.textContent =
        "Snowy";

    weatherIcon.textContent =
        "❄️";

} else if (weatherCode <= 82) {

    condition.textContent =
        "Rain Showers";

    weatherIcon.textContent =
        "🌦️";

} else {

    condition.textContent =
        "Thunderstorm";

    weatherIcon.textContent =
        "⛈️";
}


}

// ===============================
// FORMAT TIME
// ===============================

function formatTime(timeString) {


const date =
    new Date(timeString);

return date.toLocaleTimeString(
    "en-US",
    {
        hour: "2-digit",
        minute: "2-digit"
    }
);

}

// ===============================
// SEARCH WEATHER
// ===============================

searchBtn.addEventListener(
"click",
async function () {


    const city =
        cityInput.value.trim();


    if (city === "") {

        alert(
            "Please enter a city name."
        );

        return;
    }


    loading.style.display =
        "block";


    try {

        // Find city coordinates

        const locationResponse =
            await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
            );


        const locationData =
            await locationResponse.json();


        if (
            !locationData.results ||
            locationData.results.length === 0
        ) {

            loading.style.display =
                "none";

            alert("City not found.");

            return;
        }


        const location =
            locationData.results[0];


        // Get weather data

        const weatherResponse =
            await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
            );


        const weatherData =
            await weatherResponse.json();


        // Current weather

        displayWeather(
            weatherData.current,
            weatherData.daily,
            location.name
        );


        // Forecast

        displayForecast(
            weatherData.daily
        );


        loading.style.display =
            "none";


    } catch (error) {

        console.error(error);

        loading.style.display =
            "none";

        alert(
            "Something went wrong. Please try again."
        );
    }

}


);

// ===============================
// DISPLAY 5-DAY FORECAST
// ===============================

function displayForecast(daily) {


forecastContainer.innerHTML =
    "";


for (let i = 0; i < 5; i++) {

    const date =
        new Date(daily.time[i]);


    const dayName =
        date.toLocaleDateString(
            "en-US",
            {
                weekday: "short"
            }
        );


    const maxTemp =
        Math.round(
            daily.temperature_2m_max[i]
        );


    const minTemp =
        Math.round(
            daily.temperature_2m_min[i]
        );


    const weatherCode =
        daily.weather_code[i];


    let icon = "☀️";
    let text = "Clear Sky";


    if (weatherCode === 0) {

        icon = "☀️";
        text = "Clear Sky";

    } else if (weatherCode <= 3) {

        icon = "⛅";
        text = "Cloudy";

    } else if (weatherCode <= 48) {

        icon = "🌫️";
        text = "Foggy";

    } else if (weatherCode <= 67) {

        icon = "🌧️";
        text = "Rainy";

    } else if (weatherCode <= 77) {

        icon = "❄️";
        text = "Snowy";

    } else if (weatherCode <= 82) {

        icon = "🌦️";
        text = "Rain Showers";

    } else {

        icon = "⛈️";
        text = "Thunderstorm";
    }


    const card =
        document.createElement("div");


    card.className =
        "forecast-card";


    card.innerHTML = `
        <h3>${dayName}</h3>

        <div class="forecast-icon">
            ${icon}
        </div>

        <div class="forecast-temperature">
            ${maxTemp}° / ${minTemp}°
        </div>

        <div class="forecast-condition">
            ${text}
        </div>
    `;


    forecastContainer.appendChild(card);
}


}

// ===============================
// ENTER KEY SEARCH
// ===============================

cityInput.addEventListener(
"keypress",
function (event) {


    if (event.key === "Enter") {

        searchBtn.click();
    }

}

);

// ===============================
// CELSIUS / FAHRENHEIT
// ===============================

unitBtn.addEventListener(
"click",
function () {

    if (
        currentTemperatureCelsius === null
    ) {

        return;
    }


    if (isCelsius) {

        const fahrenheit =
            (currentTemperatureCelsius * 9 / 5) + 32;


        const feelsLikeFahrenheit =
            (currentFeelsLikeCelsius * 9 / 5) + 32;


        temperature.textContent =
            `${Math.round(fahrenheit)}°F`;


        feelsLike.textContent =
            `${Math.round(feelsLikeFahrenheit)}°F`;


        unitBtn.textContent =
            "Switch to °C";


        isCelsius = false;

    } else {

        temperature.textContent =
            `${Math.round(currentTemperatureCelsius)}°C`;


        feelsLike.textContent =
            `${Math.round(currentFeelsLikeCelsius)}°C`;


        unitBtn.textContent =
            "Switch to °F";


        isCelsius = true;
    }

}


);

// ===============================
// MY LOCATION WEATHER
// ===============================

locationBtn.addEventListener(
"click",
function () {


    if (!navigator.geolocation) {

        alert(
            "Geolocation is not supported by your browser."
        );

        return;
    }


    loading.style.display =
        "block";


    navigator.geolocation.getCurrentPosition(

        async function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            try {

                const response =
                    await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
                    );


                const data =
                    await response.json();


                displayWeather(
                    data.current,
                    data.daily,
                    "Your Location"
                );


                displayForecast(
                    data.daily
                );


                loading.style.display =
                    "none";


            } catch (error) {

                console.error(error);

                loading.style.display =
                    "none";

                alert(
                    "Unable to get weather data."
                );
            }

        },


        function () {

            loading.style.display =
                "none";

            alert(
                "Please allow location access."
            );

        }

    );

}

);
