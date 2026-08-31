const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

searchBtn.addEventListener("click", async function () {
    const city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    try {
        // Find the city's latitude and longitude
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        const locationData = await locationResponse.json();

        if (!locationData.results || locationData.results.length === 0) {
            alert("City not found.");
            return;
        }

        const location = locationData.results[0];

        // Get weather data
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
        );

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        cityName.textContent = location.name;
        temperature.textContent = `${Math.round(current.temperature_2m)}°C`;
        humidity.textContent = `${current.relative_humidity_2m}%`;
        wind.textContent = `${Math.round(current.wind_speed_10m)} km/h`;

        // Convert weather code to condition
        const weatherCode = current.weather_code;

        if (weatherCode === 0) {
            condition.textContent = "Clear Sky ☀️";
        } else if (weatherCode <= 3) {
            condition.textContent = "Partly Cloudy ⛅";
        } else if (weatherCode <= 48) {
            condition.textContent = "Foggy 🌫️";
        } else if (weatherCode <= 67) {
            condition.textContent = "Rainy 🌧️";
        } else if (weatherCode <= 77) {
            condition.textContent = "Snowy ❄️";
        } else if (weatherCode <= 82) {
            condition.textContent = "Rain Showers 🌦️";
        } else {
            condition.textContent = "Thunderstorm ⛈️";
        }

    } catch (error) {
        console.error(error);
        alert("Something went wrong. Please try again.");
    }
});

