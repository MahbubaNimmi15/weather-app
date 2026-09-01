const cityInput =
document.getElementById("cityInput");

const searchBtn =
document.getElementById("searchBtn");

const locationBtn =
document.getElementById("locationBtn");

const cityName =
document.getElementById("cityName");

const temperature =
document.getElementById("temperature");

const condition =
document.getElementById("condition");

const humidity =
document.getElementById("humidity");

const wind =
document.getElementById("wind");

const weatherIcon =
document.getElementById("weatherIcon");

const feelsLike =
document.getElementById("feelsLike");

const pressure =
document.getElementById("pressure");

const visibility =
document.getElementById("visibility");

const uvIndex =
document.getElementById("uvIndex");

const sunrise =
document.getElementById("sunrise");

const sunset =
document.getElementById("sunset");

const unitBtn =
document.getElementById("unitBtn");

const favoriteBtn =
document.getElementById("favoriteBtn");

const forecastContainer =
document.getElementById("forecastContainer");

const favoriteList =
document.getElementById("favoriteList");

const historyList =
document.getElementById("historyList");

const loading =
document.getElementById("loading");

const sidebar =
document.getElementById("sidebar");

const mainContent =
document.getElementById("mainContent");

const menuBtn =
document.getElementById("menuBtn");

let currentTemperatureCelsius =
null;

let currentFeelsLikeCelsius =
null;

let isCelsius = true;

let currentCity = "";

// ===============================
// SIDEBAR TOGGLE
// ===============================

menuBtn.addEventListener(
"click",
function () {

    sidebar.classList.toggle(
        "collapsed"
    );

    mainContent.classList.toggle(
        "expanded"
    );

}

);

// ===============================
// STORAGE
// ===============================

let favorites =
JSON.parse(
localStorage.getItem(
"favoriteCities"
)
) || [];

let history =
JSON.parse(
localStorage.getItem(
"searchHistory"
)
) || [];

// ===============================
// DISPLAY SIDEBAR
// ===============================

function displaySidebar() {

favoriteList.innerHTML = "";

historyList.innerHTML = "";


// =========================
// FAVORITES
// =========================

if (favorites.length === 0) {

    favoriteList.innerHTML =
        `
        <p class="empty-message sidebar-text">
            No favorite cities
        </p>
        `;

} else {

    favorites.forEach(
        function (city, index) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "sidebar-item";


            item.innerHTML =
                `
                <button
                    class="city-button"
                >
                    ⭐ ${city}
                </button>

                <button
                    class="delete-btn"
                    title="Delete favorite"
                >
                    🗑️
                </button>
                `;


            item
                .querySelector(
                    ".city-button"
                )
                .addEventListener(
                    "click",
                    function () {

                        cityInput.value =
                            city;

                        searchBtn.click();

                    }
                );


            item
                .querySelector(
                    ".delete-btn"
                )
                .addEventListener(
                    "click",
                    function () {

                        favorites.splice(
                            index,
                            1
                        );


                        localStorage.setItem(
                            "favoriteCities",
                            JSON.stringify(
                                favorites
                            )
                        );


                        displaySidebar();

                        updateFavoriteButton();

                    }
                );


            favoriteList.appendChild(
                item
            );

        }
    );

}


// =========================
// SEARCH HISTORY
// =========================

if (history.length === 0) {

    historyList.innerHTML =
        `
        <p class="empty-message sidebar-text">
            No search history
        </p>
        `;

} else {

    history.forEach(
        function (city, index) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "sidebar-item";


            item.innerHTML =
                `
                <button
                    class="city-button"
                >
                    🕘 ${city}
                </button>

                <button
                    class="delete-btn"
                    title="Delete history"
                >
                    🗑️
                </button>
                `;


            item
                .querySelector(
                    ".city-button"
                )
                .addEventListener(
                    "click",
                    function () {

                        cityInput.value =
                            city;

                        searchBtn.click();

                    }
                );


            item
                .querySelector(
                    ".delete-btn"
                )
                .addEventListener(
                    "click",
                    function () {

                        history.splice(
                            index,
                            1
                        );


                        localStorage.setItem(
                            "searchHistory",
                            JSON.stringify(
                                history
                            )
                        );


                        displaySidebar();

                    }
                );


            historyList.appendChild(
                item
            );

        }
    );

}

}

// ===============================
// ADD SEARCH HISTORY
// ===============================

function addToHistory(city) {

history =
    history.filter(
        function (item) {

            return (
                item.toLowerCase() !==
                city.toLowerCase()
            );

        }
    );


history.unshift(city);


history =
    history.slice(0, 10);


localStorage.setItem(
    "searchHistory",
    JSON.stringify(history)
);


displaySidebar();

}

// ===============================
// FAVORITE BUTTON
// ===============================

favoriteBtn.addEventListener(
"click",
function () {

    if (!currentCity) {
        return;
    }


    const index =
        favorites.findIndex(
            function (city) {

                return (
                    city.toLowerCase() ===
                    currentCity.toLowerCase()
                );

            }
        );


    if (index === -1) {

        favorites.push(
            currentCity
        );

    } else {

        favorites.splice(
            index,
            1
        );

    }


    localStorage.setItem(
        "favoriteCities",
        JSON.stringify(favorites)
    );


    displaySidebar();

    updateFavoriteButton();

}

);

// ===============================
// UPDATE FAVORITE BUTTON
// ===============================

function updateFavoriteButton() {

const exists =
    favorites.some(
        function (city) {

            return (
                city.toLowerCase() ===
                currentCity.toLowerCase()
            );

        }
    );


if (exists) {

    favoriteBtn.textContent =
        "★";

} else {

    favoriteBtn.textContent =
        "☆";

}

}

// ===============================
// WEATHER INFORMATION
// ===============================

function getWeatherInfo(
weatherCode
) {

if (weatherCode === 0) {

    return {
        text: "Clear Sky",
        icon: "☀️"
    };

} else if (weatherCode <= 3) {

    return {
        text: "Partly Cloudy",
        icon: "⛅"
    };

} else if (weatherCode <= 48) {

    return {
        text: "Foggy",
        icon: "🌫️"
    };

} else if (weatherCode <= 67) {

    return {
        text: "Rainy",
        icon: "🌧️"
    };

} else if (weatherCode <= 77) {

    return {
        text: "Snowy",
        icon: "❄️"
    };

} else if (weatherCode <= 82) {

    return {
        text: "Rain Showers",
        icon: "🌦️"
    };

} else {

    return {
        text: "Thunderstorm",
        icon: "⛈️"
    };

}

}

// ===============================
// DISPLAY WEATHER
// ===============================

function displayWeather(
current,
city,
daily
) {

currentCity =
    city;


cityName.textContent =
    city;


currentTemperatureCelsius =
    current.temperature_2m;


currentFeelsLikeCelsius =
    current.apparent_temperature;


temperature.textContent =
    `${Math.round(
        currentTemperatureCelsius
    )}°C`;


isCelsius = true;


unitBtn.textContent =
    "Switch to °F";


// =========================
// BASIC DATA
// =========================

humidity.textContent =
    `${current.relative_humidity_2m}%`;


wind.textContent =
    `${Math.round(
        current.wind_speed_10m
    )} km/h`;


// =========================
// FEELS LIKE
// =========================

feelsLike.textContent =
    `${Math.round(
        currentFeelsLikeCelsius
    )}°C`;


// =========================
// PRESSURE
// =========================

pressure.textContent =
    `${Math.round(
        current.surface_pressure
    )} hPa`;


// =========================
// VISIBILITY
// =========================

if (
    current.visibility !== undefined
) {

    visibility.textContent =
        `${(
            current.visibility / 1000
        ).toFixed(1)} km`;

} else {

    visibility.textContent =
        "-- km";

}


// =========================
// UV INDEX
// =========================

if (
    daily &&
    daily.uv_index_max &&
    daily.uv_index_max[0] !== undefined
) {

    uvIndex.textContent =
        Number(
            daily.uv_index_max[0]
        ).toFixed(1);

} else {

    uvIndex.textContent =
        "--";

}


// =========================
// SUNRISE / SUNSET
// =========================

if (daily) {

    const sunriseTime =
        new Date(
            daily.sunrise[0]
        );


    const sunsetTime =
        new Date(
            daily.sunset[0]
        );


    sunrise.textContent =
        sunriseTime.toLocaleTimeString(
            "en-US",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    sunset.textContent =
        sunsetTime.toLocaleTimeString(
            "en-US",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}


// =========================
// CONDITION
// =========================

const weatherInfo =
    getWeatherInfo(
        current.weather_code
    );


condition.textContent =
    weatherInfo.text;


weatherIcon.textContent =
    weatherInfo.icon;


updateFavoriteButton();

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

        // =========================
        // CITY LOCATION
        // =========================

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


            alert(
                "City not found."
            );


            return;

        }


        const location =
            locationData.results[0];


        // =========================
        // WEATHER API
        // =========================

        const weatherResponse =
            await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature,surface_pressure,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`
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


        addToHistory(
            location.name
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
// 5-DAY FORECAST
// ===============================

function displayForecast(daily) {

forecastContainer.innerHTML =
    "";


for (
    let i = 0;
    i < 5;
    i++
) {

    const date =
        new Date(
            daily.time[i]
        );


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


    const weatherInfo =
        getWeatherInfo(
            daily.weather_code[i]
        );


    const card =
        document.createElement(
            "div"
        );


    card.className =
        "forecast-card";


    card.innerHTML =
        `
        <h3>${dayName}</h3>

        <div class="forecast-icon">
            ${weatherInfo.icon}
        </div>

        <div class="forecast-temperature">
            ${maxTemp}° / ${minTemp}°
        </div>

        <div class="forecast-condition">
            ${weatherInfo.text}
        </div>
        `;


    forecastContainer.appendChild(
        card
    );

}

}

// ===============================
// ENTER KEY SEARCH
// ===============================

cityInput.addEventListener(
"keypress",
function (event) {

    if (
        event.key === "Enter"
    ) {

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
            (
                currentTemperatureCelsius *
                9 / 5
            ) + 32;


        const feelsLikeFahrenheit =
            (
                currentFeelsLikeCelsius *
                9 / 5
            ) + 32;


        temperature.textContent =
            `${Math.round(
                fahrenheit
            )}°F`;


        feelsLike.textContent =
            `${Math.round(
                feelsLikeFahrenheit
            )}°F`;


        unitBtn.textContent =
            "Switch to °C";


        isCelsius = false;


    } else {

        temperature.textContent =
            `${Math.round(
                currentTemperatureCelsius
            )}°C`;


        feelsLike.textContent =
            `${Math.round(
                currentFeelsLikeCelsius
            )}°C`;


        unitBtn.textContent =
            "Switch to °F";


        isCelsius = true;

    }

}

);

// ===============================
// MY LOCATION
// ===============================

locationBtn.addEventListener(
"click",
function () {

    if (
        !navigator.geolocation
    ) {

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
                        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature,surface_pressure,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`
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

// ===============================
// INITIAL SIDEBAR
// ===============================

displaySidebar();