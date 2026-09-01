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
const favoriteBtn = document.getElementById("favoriteBtn");

const forecastContainer =
document.getElementById("forecastContainer");

const loading =
document.getElementById("loading");

const favoriteList =
document.getElementById("favoriteList");

const historyList =
document.getElementById("historyList");

const sunrise =
document.getElementById("sunrise");

const sunset =
document.getElementById("sunset");

let currentTemperatureCelsius = null;
let isCelsius = true;
let currentCity = "Dhaka";

// ===============================
// LOAD SAVED DATA
// ===============================

let favoriteCities =
JSON.parse(localStorage.getItem("favoriteCities")) || [];

let searchHistory =
JSON.parse(localStorage.getItem("searchHistory")) || [];

// ===============================
// DISPLAY WEATHER
// ===============================

function displayWeather(current, city, daily) {

currentCity = city;

cityName.textContent = city;

currentTemperatureCelsius =
    current.temperature_2m;

temperature.textContent =
    `${Math.round(currentTemperatureCelsius)}°C`;

isCelsius = true;

unitBtn.textContent =
    "Switch to °F";

humidity.textContent =
    `${current.relative_humidity_2m}%`;

wind.textContent =
    `${Math.round(current.wind_speed_10m)} km/h`;


// Sunrise and Sunset
if (daily) {

    sunrise.textContent =
        formatTime(daily.sunrise[0]);

    sunset.textContent =
        formatTime(daily.sunset[0]);
}


// Weather condition
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


updateFavoriteButton();

}

// ===============================
// FORMAT TIME
// ===============================

function formatTime(time) {

if (!time) {
    return "--";
}

const date = new Date(time);

return date.toLocaleTimeString(
    "en-US",
    {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    }
);

}

// ===============================
// SEARCH WEATHER
// ===============================

async function searchWeather(city) {

if (!city) {
    return;
}

loading.style.display =
    "block";

try {

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

        alert("City not found.");

        loading.style.display =
            "none";

        return;
    }


    const location =
        locationData.results[0];


    const weatherResponse =
        await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
        );


    const weatherData =
        await weatherResponse.json();


    displayWeather(
        weatherData.current,
        location.name,
        weatherData.daily
    );


    displayForecast(
        weatherData.daily
    );


    // Add to history
    addToHistory(location.name);


    cityInput.value =
        location.name;


} catch (error) {

    console.error(error);

    alert(
        "Something went wrong. Please try again."
    );

} finally {

    loading.style.display =
        "none";
}

}

// ===============================
// SEARCH BUTTON
// ===============================

searchBtn.addEventListener(
"click",
function () {

    const city =
        cityInput.value.trim();

    if (city === "") {

        alert(
            "Please enter a city name."
        );

        return;
    }

    searchWeather(city);
}

);

// ===============================
// ENTER KEY
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
// DISPLAY 5-DAY FORECAST
// ===============================

function displayForecast(daily) {

forecastContainer.innerHTML = "";


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


    forecastContainer.appendChild(
        card
    );
}

}

// ===============================
// CELSIUS / FAHRENHEIT
// ===============================

unitBtn.addEventListener(
"click",
function () {

    if (
        currentTemperatureCelsius ===
        null
    ) {
        return;
    }


    if (isCelsius) {

        const fahrenheit =
            (
                currentTemperatureCelsius *
                9 / 5
            ) + 32;


        temperature.textContent =
            `${Math.round(fahrenheit)}°F`;


        unitBtn.textContent =
            "Switch to °C";


        isCelsius = false;

    } else {

        temperature.textContent =
            `${Math.round(currentTemperatureCelsius)}°C`;


        unitBtn.textContent =
            "Switch to °F";


        isCelsius = true;
    }
}

);

// ===============================
// FAVORITE BUTTON
// ===============================

favoriteBtn.addEventListener(
"click",
function () {

    if (!currentCity) {
        return;
    }


    if (
        favoriteCities.includes(
            currentCity
        )
    ) {

        favoriteCities =
            favoriteCities.filter(
                city =>
                    city !== currentCity
            );

    } else {

        favoriteCities.push(
            currentCity
        );
    }


    localStorage.setItem(
        "favoriteCities",
        JSON.stringify(favoriteCities)
    );


    displayFavorites();
    updateFavoriteButton();
}

);

// ===============================
// UPDATE FAVORITE ICON
// ===============================

function updateFavoriteButton() {

if (
    favoriteCities.includes(
        currentCity
    )
) {

    favoriteBtn.textContent =
        "★";

    favoriteBtn.title =
        "Remove from favorites";

} else {

    favoriteBtn.textContent =
        "☆";

    favoriteBtn.title =
        "Add to favorites";
}

}

// ===============================
// ADD SEARCH HISTORY
// ===============================

function addToHistory(city) {

searchHistory =
    searchHistory.filter(
        item =>
            item.toLowerCase() !==
            city.toLowerCase()
    );


searchHistory.unshift(city);


// Keep latest 10
searchHistory =
    searchHistory.slice(0, 10);


localStorage.setItem(
    "searchHistory",
    JSON.stringify(searchHistory)
);


displayHistory();

}

// ===============================
// DISPLAY FAVORITES
// ===============================

function displayFavorites() {

favoriteList.innerHTML = "";


if (favoriteCities.length === 0) {

    favoriteList.innerHTML =
        `<p class="empty-message">
            No favorite cities yet.
        </p>`;

    return;
}


favoriteCities.forEach(
    function (city) {

        const item =
            document.createElement("div");


        item.className =
            "saved-city";


        item.innerHTML = `
            <button class="city-button">
                ⭐ ${city}
            </button>

            <button
                class="delete-button"
                title="Delete"
            >
                🗑️
            </button>
        `;


        item.querySelector(
            ".city-button"
        ).addEventListener(
            "click",
            function () {

                searchWeather(city);
            }
        );


        item.querySelector(
            ".delete-button"
        ).addEventListener(
            "click",
            function () {

                deleteFavorite(city);
            }
        );


        favoriteList.appendChild(
            item
        );
    }
);

}

// ===============================
// DELETE FAVORITE
// ===============================

function deleteFavorite(city) {

favoriteCities =
    favoriteCities.filter(
        item => item !== city
    );


localStorage.setItem(
    "favoriteCities",
    JSON.stringify(favoriteCities)
);


displayFavorites();
updateFavoriteButton();

}

// ===============================
// DISPLAY SEARCH HISTORY
// ===============================

function displayHistory() {

historyList.innerHTML = "";


if (searchHistory.length === 0) {

    historyList.innerHTML =
        `<p class="empty-message">
            No search history yet.
        </p>`;

    return;
}


searchHistory.forEach(
    function (city) {

        const item =
            document.createElement("div");


        item.className =
            "saved-city";


        item.innerHTML = `
            <button class="city-button">
                🕘 ${city}
            </button>

            <button
                class="delete-button"
                title="Delete"
            >
                🗑️
            </button>
        `;


        item.querySelector(
            ".city-button"
        ).addEventListener(
            "click",
            function () {

                searchWeather(city);
            }
        );


        item.querySelector(
            ".delete-button"
        ).addEventListener(
            "click",
            function () {

                deleteHistory(city);
            }
        );


        historyList.appendChild(
            item
        );
    }
);

}

// ===============================
// DELETE HISTORY
// ===============================

function deleteHistory(city) {

searchHistory =
    searchHistory.filter(
        item => item !== city
    );


localStorage.setItem(
    "searchHistory",
    JSON.stringify(searchHistory)
);


displayHistory();

}

// ===============================
// MY LOCATION
// ===============================

locationBtn.addEventListener(
"click",
function () {

    if (!navigator.geolocation) {

        alert(
            "Geolocation is not supported."
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
                        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
                    );


                const data =
                    await response.json();


                displayWeather(
                    data.current,
                    "Your Location",
                    data.daily
                );


                displayForecast(
                    data.daily
                );


            } catch (error) {

                console.error(error);

                alert(
                    "Unable to get weather data."
                );

            } finally {

                loading.style.display =
                    "none";
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

// ===============================
// INITIAL DISPLAY
// ===============================

displayFavorites();
displayHistory();
updateFavoriteButton();