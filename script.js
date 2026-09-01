/* =====================================================
   🌤️ WEATHER APP JAVASCRIPT
===================================================== */


/* =====================================================
   ELEMENTS
===================================================== */

const cityInput =
    document.getElementById("cityInput");

const searchBtn =
    document.getElementById("searchBtn");

const clearSearchBtn =
    document.getElementById("clearSearchBtn");

const searchSuggestions =
    document.getElementById("searchSuggestions");

const locationBtn =
    document.getElementById("locationBtn");

const loading =
    document.getElementById("loading");

const cityName =
    document.getElementById("cityName");

const weatherIcon =
    document.getElementById("weatherIcon");

const temperature =
    document.getElementById("temperature");

const unitBtn =
    document.getElementById("unitBtn");

const condition =
    document.getElementById("condition");

const humidity =
    document.getElementById("humidity");

const wind =
    document.getElementById("wind");

const sunrise =
    document.getElementById("sunrise");

const sunset =
    document.getElementById("sunset");

const feelsLike =
    document.getElementById("feelsLike");

const visibility =
    document.getElementById("visibility");

const rainProbability =
    document.getElementById("rainProbability");

const windDirection =
    document.getElementById("windDirection");

const pressure =
    document.getElementById("pressure");

const windGusts =
    document.getElementById("windGusts");

const favoriteBtn =
    document.getElementById("favoriteBtn");

const favoriteList =
    document.getElementById("favoriteList");

const historyList =
    document.getElementById("historyList");

const hourlyContainer =
    document.getElementById("hourlyContainer");

const forecastContainer =
    document.getElementById("forecastContainer");

const menuBtn =
    document.getElementById("menuBtn");

const closeBtn =
    document.getElementById("closeBtn");

const sidebar =
    document.getElementById("sidebar");

const overlay =
    document.getElementById("overlay");

const themeBtn =
    document.getElementById("themeBtn");


/* =====================================================
   🌦️ WEATHER ALERT ELEMENTS
===================================================== */

const weatherAlert =
    document.getElementById("weatherAlert");

const alertIcon =
    document.getElementById("alertIcon");

const alertTitle =
    document.getElementById("alertTitle");

const alertMessage =
    document.getElementById("alertMessage");


/* =====================================================
   VARIABLES
===================================================== */

let currentWeatherData = null;

let currentCity = "Dhaka";

let currentUnit = "C";

let suggestionTimer = null;


/* =====================================================
   WEATHER CODE
===================================================== */

function getWeatherInfo(code) {

    const weather = {

        0: {
            icon: "☀️",
            text: "Clear Sky"
        },

        1: {
            icon: "🌤️",
            text: "Mainly Clear"
        },

        2: {
            icon: "⛅",
            text: "Partly Cloudy"
        },

        3: {
            icon: "☁️",
            text: "Overcast"
        },

        45: {
            icon: "🌫️",
            text: "Fog"
        },

        48: {
            icon: "🌫️",
            text: "Depositing Rime Fog"
        },

        51: {
            icon: "🌦️",
            text: "Light Drizzle"
        },

        53: {
            icon: "🌦️",
            text: "Moderate Drizzle"
        },

        55: {
            icon: "🌧️",
            text: "Heavy Drizzle"
        },

        61: {
            icon: "🌦️",
            text: "Light Rain"
        },

        63: {
            icon: "🌧️",
            text: "Moderate Rain"
        },

        65: {
            icon: "🌧️",
            text: "Heavy Rain"
        },

        71: {
            icon: "🌨️",
            text: "Light Snow"
        },

        73: {
            icon: "🌨️",
            text: "Moderate Snow"
        },

        75: {
            icon: "❄️",
            text: "Heavy Snow"
        },

        80: {
            icon: "🌦️",
            text: "Rain Showers"
        },

        81: {
            icon: "🌧️",
            text: "Moderate Rain Showers"
        },

        82: {
            icon: "⛈️",
            text: "Heavy Rain Showers"
        },

        95: {
            icon: "⛈️",
            text: "Thunderstorm"
        },

        96: {
            icon: "⛈️",
            text: "Thunderstorm with Hail"
        },

        99: {
            icon: "⛈️",
            text: "Heavy Thunderstorm"
        }

    };


    return weather[code] || {

        icon: "🌤️",

        text: "Unknown"

    };

}


/* =====================================================
   🌦️ WEATHER ALERT / STATUS
===================================================== */

function updateWeatherAlert(weatherCondition) {

    if (
        !weatherAlert ||
        !alertIcon ||
        !alertTitle ||
        !alertMessage
    ) {
        return;
    }


    const conditionText =
        String(weatherCondition || "")
            .toLowerCase();


    /* Remove old classes */

    weatherAlert.classList.remove(
        "rain",
        "storm",
        "fog",
        "snow",
        "clear"
    );


    /* =================================================
       ⛈️ STORM
    ================================================= */

    if (
        conditionText.includes("thunder") ||
        conditionText.includes("storm")
    ) {

        alertIcon.textContent =
            "⛈️";

        alertTitle.textContent =
            "Storm Alert";

        alertMessage.textContent =
            "Thunderstorm conditions may occur. Please stay aware of the weather.";

        weatherAlert.classList.add(
            "storm"
        );

    }


    /* =================================================
       🌧️ RAIN
    ================================================= */

    else if (
        conditionText.includes("rain") ||
        conditionText.includes("drizzle") ||
        conditionText.includes("shower")
    ) {

        alertIcon.textContent =
            "🌧️";

        alertTitle.textContent =
            "Rain Alert";

        alertMessage.textContent =
            "Rain is expected. You may want to carry an umbrella.";

        weatherAlert.classList.add(
            "rain"
        );

    }


    /* =================================================
       ❄️ SNOW
    ================================================= */

    else if (
        conditionText.includes("snow") ||
        conditionText.includes("sleet")
    ) {

        alertIcon.textContent =
            "❄️";

        alertTitle.textContent =
            "Snow Alert";

        alertMessage.textContent =
            "Snowy weather conditions are expected.";

        weatherAlert.classList.add(
            "snow"
        );

    }


    /* =================================================
       🌫️ FOG
    ================================================= */

    else if (
        conditionText.includes("fog") ||
        conditionText.includes("mist") ||
        conditionText.includes("haze")
    ) {

        alertIcon.textContent =
            "🌫️";

        alertTitle.textContent =
            "Low Visibility";

        alertMessage.textContent =
            "Foggy or hazy conditions may reduce visibility.";

        weatherAlert.classList.add(
            "fog"
        );

    }


    /* =================================================
       ☁️ CLOUDY
    ================================================= */

    else if (
        conditionText.includes("cloud") ||
        conditionText.includes("overcast")
    ) {

        alertIcon.textContent =
            "☁️";

        alertTitle.textContent =
            "Cloudy Weather";

        alertMessage.textContent =
            "The sky is mostly cloudy at the moment.";

    }


    /* =================================================
       ☀️ CLEAR
    ================================================= */

    else if (
        conditionText.includes("clear") ||
        conditionText.includes("sunny")
    ) {

        alertIcon.textContent =
            "☀️";

        alertTitle.textContent =
            "Clear Weather";

        alertMessage.textContent =
            "The weather is clear and pleasant right now.";

        weatherAlert.classList.add(
            "clear"
        );

    }


    /* =================================================
       🌤️ DEFAULT
    ================================================= */

    else {

        alertIcon.textContent =
            "🌤️";

        alertTitle.textContent =
            "Weather Status";

        alertMessage.textContent =
            "Current weather conditions are available above.";

    }

}


/* =====================================================
   FORMAT TIME
===================================================== */

function formatTime(timeString) {

    if (!timeString) {

        return "--:--";

    }


    const date =
        new Date(timeString);


    return date.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =====================================================
   FORMAT DATE
===================================================== */

function formatDate(dateString) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        [],
        {
            weekday: "short"
        }
    );

}


/* =====================================================
   GET WIND DIRECTION
===================================================== */

function getWindDirection(degrees) {

    const directions = [

        "N",
        "NE",
        "E",
        "SE",
        "S",
        "SW",
        "W",
        "NW"

    ];


    const index =
        Math.round(
            degrees / 45
        ) % 8;


    return directions[index];

}


/* =====================================================
   SHOW / HIDE LOADING
===================================================== */

function showLoading() {

    loading.style.display =
        "block";

}


function hideLoading() {

    loading.style.display =
        "none";

}


/* =====================================================
   CLEAR SEARCH
===================================================== */

function updateClearButton() {

    if (
        cityInput.value.trim() !== ""
    ) {

        clearSearchBtn.classList.add(
            "show"
        );

    } else {

        clearSearchBtn.classList.remove(
            "show"
        );

    }

}


clearSearchBtn.addEventListener(
    "click",
    () => {

        cityInput.value = "";

        searchSuggestions.innerHTML = "";

        searchSuggestions.classList.remove(
            "show"
        );

        updateClearButton();

        cityInput.focus();

    }
);


/* =====================================================
   SEARCH CITY
===================================================== */

async function searchCity(city) {

    if (
        !city ||
        city.trim() === ""
    ) {

        return;

    }


    showLoading();

    searchSuggestions.classList.remove(
        "show"
    );


    try {

        const url =
            "https://geocoding-api.open-meteo.com/v1/search" +
            "?name=" +
            encodeURIComponent(
                city.trim()
            ) +
            "&count=1" +
            "&language=en" +
            "&format=json";


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "City search failed"
            );

        }


        const data =
            await response.json();


        if (
            !data.results ||
            data.results.length === 0
        ) {

            alert(
                "❌ City not found. Please try another city."
            );

            hideLoading();

            return;

        }


        const location =
            data.results[0];


        await loadWeather(
            location.latitude,
            location.longitude,
            location.name,
            location.country
        );


    } catch (error) {

        console.error(error);

        alert(
            "❌ Unable to search city. Please try again."
        );

    }


    hideLoading();

}


/* =====================================================
   LOAD WEATHER
===================================================== */

async function loadWeather(
    latitude,
    longitude,
    name,
    country = ""
) {

    showLoading();


    try {

        const url =
            "https://api.open-meteo.com/v1/forecast" +
            "?latitude=" +
            latitude +
            "&longitude=" +
            longitude +
            "&current=" +
            "temperature_2m," +
            "relative_humidity_2m," +
            "apparent_temperature," +
            "is_day," +
            "precipitation," +
            "rain," +
            "weather_code," +
            "surface_pressure," +
            "wind_speed_10m," +
            "wind_direction_10m," +
            "wind_gusts_10m" +
            "&hourly=" +
            "temperature_2m," +
            "weather_code," +
            "precipitation_probability," +
            "visibility," +
            "wind_speed_10m" +
            "&daily=" +
            "weather_code," +
            "temperature_2m_max," +
            "temperature_2m_min," +
            "sunrise," +
            "sunset," +
            "precipitation_probability_max" +
            "&forecast_days=6" +
            "&timezone=auto";


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Weather request failed"
            );

        }


        const data =
            await response.json();


        currentWeatherData =
            data;

        currentCity =
            name;


        displayCurrentWeather(
            data,
            name,
            country
        );


        displayHourlyWeather(
            data
        );


        displayFiveDayForecast(
            data
        );


        addToHistory(
            name
        );


        updateFavoriteButton();

        updateClearButton();


    } catch (error) {

        console.error(error);

        alert(
            "❌ Unable to load weather data."
        );

    }


    hideLoading();

}


/* =====================================================
   DISPLAY CURRENT WEATHER
===================================================== */

function displayCurrentWeather(
    data,
    name,
    country
) {

    const current =
        data.current;


    const weather =
        getWeatherInfo(
            current.weather_code
        );


    cityName.textContent =
        country
            ? `${name}, ${country}`
            : name;


    weatherIcon.textContent =
        weather.icon;


    condition.textContent =
        weather.text;


    /* 🌦️ UPDATE WEATHER ALERT */

    updateWeatherAlert(
        weather.text
    );


    updateTemperatureDisplay(
        current.temperature_2m
    );


    humidity.textContent =
        `${current.relative_humidity_2m}%`;


    wind.textContent =
        `${Math.round(
            current.wind_speed_10m
        )} km/h`;


    feelsLike.textContent =
        formatTemperature(
            current.apparent_temperature
        );


    pressure.textContent =
        `${Math.round(
            current.surface_pressure
        )} hPa`;


    windGusts.textContent =
        `${Math.round(
            current.wind_gusts_10m || 0
        )} km/h`;


    windDirection.textContent =
        getWindDirection(
            current.wind_direction_10m
        );


    /* Sunrise */

    if (
        data.daily &&
        data.daily.sunrise
    ) {

        sunrise.textContent =
            formatTime(
                data.daily.sunrise[0]
            );

    }


    /* Sunset */

    if (
        data.daily &&
        data.daily.sunset
    ) {

        sunset.textContent =
            formatTime(
                data.daily.sunset[0]
            );

    }


    /* Rain probability */

    if (
        data.daily &&
        data.daily.precipitation_probability_max
    ) {

        rainProbability.textContent =
            `${data.daily.precipitation_probability_max[0]}%`;

    }


    /* Visibility */

    if (
        data.hourly &&
        data.hourly.visibility
    ) {

        const nowVisibility =
            data.hourly.visibility[0];


        visibility.textContent =
            `${Math.round(
                nowVisibility / 1000
            )} km`;

    }

}


/* =====================================================
   TEMPERATURE FORMAT
===================================================== */

function formatTemperature(
    celsius
) {

    if (
        currentUnit === "C"
    ) {

        return `${Math.round(
            celsius
        )}°C`;

    }


    const fahrenheit =
        (celsius * 9 / 5) + 32;


    return `${Math.round(
        fahrenheit
    )}°F`;

}


/* =====================================================
   UPDATE TEMPERATURE
===================================================== */

function updateTemperatureDisplay(
    celsius
) {

    temperature.textContent =
        formatTemperature(
            celsius
        );


    unitBtn.textContent =
        currentUnit === "C"
            ? "Switch to °F"
            : "Switch to °C";

}


/* =====================================================
   UNIT BUTTON
===================================================== */

unitBtn.addEventListener(
    "click",
    () => {

        currentUnit =
            currentUnit === "C"
                ? "F"
                : "C";


        if (
            currentWeatherData &&
            currentWeatherData.current
        ) {

            updateTemperatureDisplay(
                currentWeatherData
                    .current
                    .temperature_2m
            );


            updateExtraTemperature();


            displayHourlyWeather(
                currentWeatherData
            );


            displayFiveDayForecast(
                currentWeatherData
            );

        }

    }
);


/* =====================================================
   UPDATE EXTRA TEMPERATURE
===================================================== */

function updateExtraTemperature() {

    if (
        currentWeatherData &&
        currentWeatherData.current
    ) {

        feelsLike.textContent =
            formatTemperature(
                currentWeatherData
                    .current
                    .apparent_temperature
            );

    }

}


/* =====================================================
   HOURLY FORECAST
===================================================== */

function displayHourlyWeather(
    data
) {

    hourlyContainer.innerHTML =
        "";


    if (!data.hourly) {

        return;

    }


    const hourly =
        data.hourly;


    const currentHour =
        new Date().getHours();


    let startIndex = 0;


    for (
        let i = 0;
        i < hourly.time.length;
        i++
    ) {

        const hour =
            new Date(
                hourly.time[i]
            ).getHours();


        if (
            hour >= currentHour
        ) {

            startIndex = i;

            break;

        }

    }


    const endIndex =
        Math.min(
            startIndex + 12,
            hourly.time.length
        );


    for (
        let i = startIndex;
        i < endIndex;
        i++
    ) {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "hourly-card";


        const weather =
            getWeatherInfo(
                hourly.weather_code[i]
            );


        const temp =
            formatTemperature(
                hourly.temperature_2m[i]
            );


        const rain =
            hourly.precipitation_probability
                ? hourly.precipitation_probability[i]
                : 0;


        card.innerHTML = `

            <div class="hourly-time">
                ${formatTime(
                    hourly.time[i]
                )}
            </div>

            <div class="hourly-icon">
                ${weather.icon}
            </div>

            <div class="hourly-temp">
                ${temp}
            </div>

            <div class="hourly-rain">
                🌧️ ${rain}%
            </div>

        `;


        hourlyContainer.appendChild(
            card
        );

    }

}


/* =====================================================
   5 DAY FORECAST
===================================================== */

function displayFiveDayForecast(
    data
) {

    forecastContainer.innerHTML =
        "";


    if (!data.daily) {

        return;

    }


    const daily =
        data.daily;


    const days =
        Math.min(
            5,
            daily.time.length
        );


    for (
        let i = 0;
        i < days;
        i++
    ) {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "forecast-card";


        const weather =
            getWeatherInfo(
                daily.weather_code[i]
            );


        const maxTemp =
            formatTemperature(
                daily.temperature_2m_max[i]
            );


        const minTemp =
            formatTemperature(
                daily.temperature_2m_min[i]
            );


        const rain =
            daily.precipitation_probability_max
                ? daily.precipitation_probability_max[i]
                : 0;


        card.innerHTML = `

            <h3>
                ${formatDate(
                    daily.time[i]
                )}
            </h3>

            <div class="forecast-icon">
                ${weather.icon}
            </div>

            <div class="forecast-temperature">
                ${maxTemp} / ${minTemp}
            </div>

            <div class="forecast-condition">
                ${weather.text}
            </div>

            <div class="forecast-condition">
                🌧️ ${rain}% rain
            </div>

        `;


        forecastContainer.appendChild(
            card
        );

    }

}


/* =====================================================
   SEARCH BUTTON
===================================================== */

searchBtn.addEventListener(
    "click",
    () => {

        const city =
            cityInput.value.trim();


        if (city !== "") {

            searchCity(city);

        }

    }
);


/* =====================================================
   ENTER KEY SEARCH
===================================================== */

cityInput.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();


            const city =
                cityInput.value.trim();


            if (city !== "") {

                searchCity(city);

            }

        }

    }
);


/* =====================================================
   CITY SUGGESTIONS
===================================================== */

cityInput.addEventListener(
    "input",
    () => {

        const value =
            cityInput.value.trim();


        updateClearButton();


        clearTimeout(
            suggestionTimer
        );


        if (
            value.length < 2
        ) {

            searchSuggestions.innerHTML =
                "";

            searchSuggestions.classList.remove(
                "show"
            );

            return;

        }


        suggestionTimer =
            setTimeout(
                () => {

                    getCitySuggestions(
                        value
                    );

                },
                350
            );

    }
);


/* =====================================================
   GET CITY SUGGESTIONS
===================================================== */

async function getCitySuggestions(
    query
) {

    searchSuggestions.innerHTML = `
        <div class="suggestion-loading">
            🔎 Searching cities...
        </div>
    `;


    searchSuggestions.classList.add(
        "show"
    );


    try {

        const url =
            "https://geocoding-api.open-meteo.com/v1/search" +
            "?name=" +
            encodeURIComponent(query) +
            "&count=8" +
            "&language=en" +
            "&format=json";


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Suggestion request failed"
            );

        }


        const data =
            await response.json();


        searchSuggestions.innerHTML =
            "";


        if (
            !data.results ||
            data.results.length === 0
        ) {

            searchSuggestions.innerHTML = `
                <div class="no-suggestion">
                    ❌ No city found
                </div>
            `;

            return;

        }


        data.results.forEach(
            (location) => {

                const item =
                    document.createElement(
                        "button"
                    );


                item.type =
                    "button";


                item.className =
                    "search-suggestion";


                const country =
                    location.country || "";


                const admin =
                    location.admin1 || "";


                item.innerHTML = `

                    <span class="suggestion-icon">
                        📍
                    </span>

                    <strong>
                        ${location.name}
                    </strong>

                    ${
                        admin
                            ? `, ${admin}`
                            : ""
                    }

                    ${
                        country
                            ? `, ${country}`
                            : ""
                    }

                `;


                item.addEventListener(
                    "click",
                    async () => {

                        cityInput.value =
                            location.name;


                        updateClearButton();


                        searchSuggestions
                            .innerHTML =
                            "";


                        searchSuggestions
                            .classList.remove(
                                "show"
                            );


                        await loadWeather(
                            location.latitude,
                            location.longitude,
                            location.name,
                            location.country
                        );

                    }
                );


                searchSuggestions
                    .appendChild(
                        item
                    );

            }
        );


    } catch (error) {

        console.error(error);

        searchSuggestions.innerHTML = `
            <div class="no-suggestion">
                ⚠️ Unable to load suggestions
            </div>
        `;

    }

}


/* =====================================================
   CLICK OUTSIDE SUGGESTIONS
===================================================== */

document.addEventListener(
    "click",
    (event) => {

        if (
            !event.target.closest(
                ".search-wrapper"
            )
        ) {

            searchSuggestions
                .classList.remove(
                    "show"
                );

        }

    }
);


/* =====================================================
   LOCATION
===================================================== */

locationBtn.addEventListener(
    "click",
    () => {

        if (
            !navigator.geolocation
        ) {

            alert(
                "❌ Geolocation is not supported."
            );

            return;

        }


        showLoading();


        navigator.geolocation.getCurrentPosition(

            async (position) => {

                const latitude =
                    position.coords.latitude;


                const longitude =
                    position.coords.longitude;


                try {

                    const url =
                        "https://geocoding-api.open-meteo.com/v1/reverse" +
                        "?latitude=" +
                        latitude +
                        "&longitude=" +
                        longitude +
                        "&count=1" +
                        "&language=en" +
                        "&format=json";


                    const response =
                        await fetch(url);


                    const data =
                        await response.json();


                    let name =
                        "My Location";


                    let country =
                        "";


                    if (
                        data.results &&
                        data.results.length
                    ) {

                        name =
                            data.results[0]
                                .name;


                        country =
                            data.results[0]
                                .country || "";

                    }


                    await loadWeather(
                        latitude,
                        longitude,
                        name,
                        country
                    );


                } catch (error) {

                    console.error(error);

                    alert(
                        "❌ Could not detect your city."
                    );

                    hideLoading();

                }

            },


            () => {

                alert(
                    "❌ Location permission denied."
                );

                hideLoading();

            }

        );

    }
);


/* =====================================================
   FAVORITES
===================================================== */

function getFavorites() {

    return JSON.parse(
        localStorage.getItem(
            "weatherFavorites"
        ) || "[]"
    );

}


function saveFavorites(
    favorites
) {

    localStorage.setItem(
        "weatherFavorites",
        JSON.stringify(
            favorites
        )
    );

}


function updateFavoriteButton() {

    const favorites =
        getFavorites();


    const exists =
        favorites.some(
            city =>
                city.toLowerCase() ===
                currentCity.toLowerCase()
        );


    favoriteBtn.textContent =
        exists
            ? "★"
            : "☆";

}


favoriteBtn.addEventListener(
    "click",
    () => {

        if (!currentCity) {

            return;

        }


        let favorites =
            getFavorites();


        const exists =
            favorites.some(
                city =>
                    city.toLowerCase() ===
                    currentCity.toLowerCase()
            );


        if (exists) {

            favorites =
                favorites.filter(
                    city =>
                        city.toLowerCase() !==
                        currentCity.toLowerCase()
                );

        } else {

            favorites.push(
                currentCity
            );

        }


        saveFavorites(
            favorites
        );


        updateFavoriteButton();

        renderFavorites();

    }
);


/* =====================================================
   RENDER FAVORITES
===================================================== */

function renderFavorites() {

    const favorites =
        getFavorites();


    favoriteList.innerHTML =
        "";


    if (
        favorites.length === 0
    ) {

        favoriteList.innerHTML = `
            <p class="empty-message">
                No favorite cities
            </p>
        `;

        return;

    }


    favorites.forEach(
        (city, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "sidebar-item";


            const cityButton =
                document.createElement(
                    "button"
                );


            cityButton.className =
                "city-button";


            cityButton.textContent =
                `📍 ${city}`;


            cityButton.addEventListener(
                "click",
                () => {

                    cityInput.value =
                        city;


                    updateClearButton();

                    searchCity(
                        city
                    );

                    closeSidebar();

                }
            );


            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.className =
                "delete-btn";


            deleteButton.textContent =
                "🗑️";


            deleteButton.title =
                "Remove favorite";


            deleteButton.addEventListener(
                "click",
                () => {

                    favorites.splice(
                        index,
                        1
                    );


                    saveFavorites(
                        favorites
                    );


                    renderFavorites();

                    updateFavoriteButton();

                }
            );


            item.appendChild(
                cityButton
            );


            item.appendChild(
                deleteButton
            );


            favoriteList.appendChild(
                item
            );

        }
    );

}


/* =====================================================
   SEARCH HISTORY
===================================================== */

function getHistory() {

    return JSON.parse(
        localStorage.getItem(
            "weatherHistory"
        ) || "[]"
    );

}


function saveHistory(
    history
) {

    localStorage.setItem(
        "weatherHistory",
        JSON.stringify(
            history
        )
    );

}


function addToHistory(
    city
) {

    let history =
        getHistory();


    history =
        history.filter(
            item =>
                item.toLowerCase() !==
                city.toLowerCase()
        );


    history.unshift(
        city
    );


    history =
        history.slice(
            0,
            10
        );


    saveHistory(
        history
    );


    renderHistory();

}


/* =====================================================
   RENDER HISTORY
===================================================== */

function renderHistory() {

    const history =
        getHistory();


    historyList.innerHTML =
        "";


    if (
        history.length === 0
    ) {

        historyList.innerHTML = `
            <p class="empty-message">
                No search history
            </p>
        `;

        return;

    }


    history.forEach(
        (city, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "sidebar-item";


            const cityButton =
                document.createElement(
                    "button"
                );


            cityButton.className =
                "city-button";


            cityButton.textContent =
                `🕘 ${city}`;


            cityButton.addEventListener(
                "click",
                () => {

                    cityInput.value =
                        city;


                    updateClearButton();

                    searchCity(
                        city
                    );

                    closeSidebar();

                }
            );


            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.className =
                "delete-btn";


            deleteButton.textContent =
                "🗑️";


            deleteButton.title =
                "Remove history";


            deleteButton.addEventListener(
                "click",
                () => {

                    history.splice(
                        index,
                        1
                    );


                    saveHistory(
                        history
                    );


                    renderHistory();

                }
            );


            item.appendChild(
                cityButton
            );


            item.appendChild(
                deleteButton
            );


            historyList.appendChild(
                item
            );

        }
    );

}


/* =====================================================
   SIDEBAR OPEN
===================================================== */

menuBtn.addEventListener(
    "click",
    () => {

        sidebar.classList.add(
            "active"
        );


        overlay.classList.add(
            "active"
        );

    }
);


/* =====================================================
   SIDEBAR CLOSE
===================================================== */

function closeSidebar() {

    sidebar.classList.remove(
        "active"
    );


    overlay.classList.remove(
        "active"
    );

}


closeBtn.addEventListener(
    "click",
    closeSidebar
);


overlay.addEventListener(
    "click",
    closeSidebar
);


/* =====================================================
   DARK MODE
===================================================== */

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark-mode"
        );


        const darkMode =
            document.body.classList.contains(
                "dark-mode"
            );


        themeBtn.textContent =
            darkMode
                ? "☀️"
                : "🌙";


        localStorage.setItem(
            "weatherDarkMode",
            darkMode
                ? "true"
                : "false"
        );

    }
);


/* =====================================================
   LOAD DARK MODE
===================================================== */

function loadDarkMode() {

    const darkMode =
        localStorage.getItem(
            "weatherDarkMode"
        );


    if (
        darkMode === "true"
    ) {

        document.body.classList.add(
            "dark-mode"
        );


        themeBtn.textContent =
            "☀️";

    }

}


/* =====================================================
   INITIAL LOAD
===================================================== */

function initializeApp() {

    renderFavorites();

    renderHistory();

    loadDarkMode();

    updateClearButton();

}


/* =====================================================
   DEFAULT WEATHER
===================================================== */

async function loadDefaultWeather() {

    await loadWeather(
        23.8103,
        90.4125,
        "Dhaka",
        "Bangladesh"
    );

}


/* =====================================================
   START APP
===================================================== */

initializeApp();

loadDefaultWeather();