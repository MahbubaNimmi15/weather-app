/* =====================================================
   🌤️ WEATHER APP - COMPLETE JAVASCRIPT
   Search + Location + Dark Mode + Favorite + History
   °C / °F + Hourly + 5-Day Forecast
===================================================== */


/* =====================================================
   ELEMENTS
===================================================== */

const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

const themeBtn = document.getElementById("themeBtn");

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const weatherIcon = document.getElementById("weatherIcon");

const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

const unitBtn = document.getElementById("unitBtn");
const favoriteBtn = document.getElementById("favoriteBtn");

const forecastContainer =
    document.getElementById("forecastContainer");

const hourlyContainer =
    document.getElementById("hourlyContainer");

const favoriteList =
    document.getElementById("favoriteList");

const historyList =
    document.getElementById("historyList");

const loading =
    document.getElementById("loading");


/* EXTRA DETAILS */

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


/* =====================================================
   VARIABLES
===================================================== */

let currentTemperatureCelsius = null;
let currentFeelsLikeCelsius = null;

let currentForecastData = null;
let currentHourlyData = null;

let isCelsius = true;
let currentCity = "";


/* =====================================================
   LOCAL STORAGE
===================================================== */

let favorites = [];

let history = [];


try {
    favorites =
        JSON.parse(
            localStorage.getItem("favoriteCities")
        ) || [];
} catch (error) {
    favorites = [];
}


try {
    history =
        JSON.parse(
            localStorage.getItem("searchHistory")
        ) || [];
} catch (error) {
    history = [];
}


/* =====================================================
   HELPER
===================================================== */

function showLoading(show) {

    if (!loading) return;

    loading.style.display =
        show ? "block" : "none";
}


/* =====================================================
   SIDEBAR
===================================================== */

function openSidebar() {

    if (sidebar) {
        sidebar.classList.add("active");
    }

    if (overlay) {
        overlay.classList.add("active");
    }
}


function closeSidebar() {

    if (sidebar) {
        sidebar.classList.remove("active");
    }

    if (overlay) {
        overlay.classList.remove("active");
    }
}


if (menuBtn) {
    menuBtn.addEventListener(
        "click",
        openSidebar
    );
}


if (closeBtn) {
    closeBtn.addEventListener(
        "click",
        closeSidebar
    );
}


if (overlay) {
    overlay.addEventListener(
        "click",
        closeSidebar
    );
}


/* =====================================================
   DARK / LIGHT MODE
===================================================== */

const savedTheme =
    localStorage.getItem("weatherTheme");


if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    if (themeBtn) {
        themeBtn.textContent = "☀️";
    }

} else {

    if (themeBtn) {
        themeBtn.textContent = "🌙";
    }
}


if (themeBtn) {

    themeBtn.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "dark-mode"
            );

            const isDark =
                document.body.classList.contains(
                    "dark-mode"
                );


            if (isDark) {

                themeBtn.textContent = "☀️";

                localStorage.setItem(
                    "weatherTheme",
                    "dark"
                );

            } else {

                themeBtn.textContent = "🌙";

                localStorage.setItem(
                    "weatherTheme",
                    "light"
                );
            }
        }
    );
}


/* =====================================================
   DISPLAY SIDEBAR
===================================================== */

function displaySidebar() {

    if (!favoriteList || !historyList) {
        return;
    }


    favoriteList.innerHTML = "";
    historyList.innerHTML = "";


    /* ===============================
       FAVORITES
    ================================ */

    if (favorites.length === 0) {

        favoriteList.innerHTML = `
            <p class="empty-message">
                No favorite cities
            </p>
        `;

    } else {

        favorites.forEach(
            function (city, index) {

                const item =
                    document.createElement("div");

                item.className =
                    "sidebar-item";


                item.innerHTML = `
                    <button
                        class="city-button"
                        type="button"
                    >
                        ⭐ ${city}
                    </button>

                    <button
                        class="delete-btn"
                        type="button"
                        title="Delete favorite"
                    >
                        🗑️
                    </button>
                `;


                const cityButton =
                    item.querySelector(
                        ".city-button"
                    );


                const deleteButton =
                    item.querySelector(
                        ".delete-btn"
                    );


                if (cityButton) {

                    cityButton.addEventListener(
                        "click",
                        function () {

                            if (cityInput) {
                                cityInput.value =
                                    city;
                            }

                            closeSidebar();

                            searchWeather(city);
                        }
                    );
                }


                if (deleteButton) {

                    deleteButton.addEventListener(
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
                }


                favoriteList.appendChild(item);
            }
        );
    }


    /* ===============================
       HISTORY
    ================================ */

    if (history.length === 0) {

        historyList.innerHTML = `
            <p class="empty-message">
                No search history
            </p>
        `;

    } else {

        history.forEach(
            function (city, index) {

                const item =
                    document.createElement("div");

                item.className =
                    "sidebar-item";


                item.innerHTML = `
                    <button
                        class="city-button"
                        type="button"
                    >
                        🕘 ${city}
                    </button>

                    <button
                        class="delete-btn"
                        type="button"
                        title="Delete history"
                    >
                        🗑️
                    </button>
                `;


                const cityButton =
                    item.querySelector(
                        ".city-button"
                    );


                const deleteButton =
                    item.querySelector(
                        ".delete-btn"
                    );


                if (cityButton) {

                    cityButton.addEventListener(
                        "click",
                        function () {

                            if (cityInput) {
                                cityInput.value =
                                    city;
                            }

                            closeSidebar();

                            searchWeather(city);
                        }
                    );
                }


                if (deleteButton) {

                    deleteButton.addEventListener(
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
                }


                historyList.appendChild(item);
            }
        );
    }
}


/* =====================================================
   SEARCH HISTORY
===================================================== */

function addToHistory(city) {

    if (!city) {
        return;
    }


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


/* =====================================================
   FAVORITE
===================================================== */

if (favoriteBtn) {

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

                favorites.push(currentCity);

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
}


function updateFavoriteButton() {

    if (!favoriteBtn) {
        return;
    }


    if (!currentCity) {

        favoriteBtn.textContent = "☆";

        return;
    }


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

        favoriteBtn.textContent = "★";

        favoriteBtn.title =
            "Remove from favorites";

    } else {

        favoriteBtn.textContent = "☆";

        favoriteBtn.title =
            "Add to favorites";
    }
}


/* =====================================================
   WEATHER CONDITION
===================================================== */

function getWeatherInfo(weatherCode) {

    if (weatherCode === 0) {

        return {
            icon: "☀️",
            text: "Clear Sky"
        };
    }


    if (weatherCode >= 1 && weatherCode <= 3) {

        return {
            icon: "⛅",
            text: "Partly Cloudy"
        };
    }


    if (weatherCode >= 45 && weatherCode <= 48) {

        return {
            icon: "🌫️",
            text: "Foggy"
        };
    }


    if (weatherCode >= 51 && weatherCode <= 67) {

        return {
            icon: "🌧️",
            text: "Rainy"
        };
    }


    if (weatherCode >= 71 && weatherCode <= 77) {

        return {
            icon: "❄️",
            text: "Snowy"
        };
    }


    if (weatherCode >= 80 && weatherCode <= 82) {

        return {
            icon: "🌦️",
            text: "Rain Showers"
        };
    }


    if (weatherCode >= 95) {

        return {
            icon: "⛈️",
            text: "Thunderstorm"
        };
    }


    return {
        icon: "🌤️",
        text: "Weather"
    };
}


/* =====================================================
   WIND DIRECTION
===================================================== */

function getWindDirection(degrees) {

    if (
        degrees === null ||
        degrees === undefined ||
        isNaN(degrees)
    ) {

        return "--";
    }


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
        Math.round(degrees / 45) % 8;


    return directions[index];
}


/* =====================================================
   CELSIUS TO FAHRENHEIT
===================================================== */

function celsiusToFahrenheit(celsius) {

    return (
        celsius * 9 / 5
    ) + 32;
}


/* =====================================================
   DISPLAY WEATHER
===================================================== */

function displayWeather(
    current,
    city,
    daily,
    hourly
) {

    if (!current) {
        return;
    }


    currentCity = city || "Unknown";


    if (cityName) {
        cityName.textContent =
            currentCity;
    }


    /* TEMPERATURE */

    currentTemperatureCelsius =
        current.temperature_2m;


    currentFeelsLikeCelsius =
        current.apparent_temperature;


    isCelsius = true;


    if (temperature) {

        temperature.textContent =
            `${Math.round(
                currentTemperatureCelsius
            )}°C`;
    }


    if (unitBtn) {

        unitBtn.textContent =
            "Switch to °F";
    }


    /* HUMIDITY */

    if (humidity) {

        humidity.textContent =
            `${Math.round(
                current.relative_humidity_2m
            )}%`;
    }


    /* WIND */

    if (wind) {

        wind.textContent =
            `${Math.round(
                current.wind_speed_10m
            )} km/h`;
    }


    /* SUNRISE / SUNSET */

    if (
        daily &&
        daily.sunrise &&
        daily.sunset &&
        daily.sunrise[0] &&
        daily.sunset[0]
    ) {

        const sunriseTime =
            new Date(
                daily.sunrise[0]
            );


        const sunsetTime =
            new Date(
                daily.sunset[0]
            );


        if (sunrise) {

            sunrise.textContent =
                sunriseTime.toLocaleTimeString(
                    "en-US",
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );
        }


        if (sunset) {

            sunset.textContent =
                sunsetTime.toLocaleTimeString(
                    "en-US",
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );
        }
    }


    /* WEATHER CONDITION */

    const weatherInfo =
        getWeatherInfo(
            current.weather_code
        );


    if (condition) {

        condition.textContent =
            weatherInfo.text;
    }


    if (weatherIcon) {

        weatherIcon.textContent =
            weatherInfo.icon;
    }


    /* FEELS LIKE */

    if (
        feelsLike &&
        current.apparent_temperature !== undefined
    ) {

        feelsLike.textContent =
            `${Math.round(
                current.apparent_temperature
            )}°C`;
    }


    /* VISIBILITY */

    if (
        visibility &&
        current.visibility !== undefined
    ) {

        visibility.textContent =
            `${(
                current.visibility / 1000
            ).toFixed(1)} km`;
    }


    /* PRESSURE */

    if (
        pressure &&
        current.surface_pressure !== undefined
    ) {

        pressure.textContent =
            `${Math.round(
                current.surface_pressure
            )} hPa`;
    }


    /* WIND DIRECTION */

    if (
        windDirection &&
        current.wind_direction_10m !== undefined
    ) {

        windDirection.textContent =
            `${getWindDirection(
                current.wind_direction_10m
            )} (${Math.round(
                current.wind_direction_10m
            )}°)`;
    }


    /* WIND GUST */

    if (
        windGusts &&
        current.wind_gusts_10m !== undefined
    ) {

        windGusts.textContent =
            `${Math.round(
                current.wind_gusts_10m
            )} km/h`;
    }


    /* RAIN */

    if (
        rainProbability &&
        daily &&
        daily.precipitation_probability_max &&
        daily.precipitation_probability_max[0] !== undefined
    ) {

        rainProbability.textContent =
            `${daily.precipitation_probability_max[0]}%`;

    } else if (rainProbability) {

        rainProbability.textContent =
            "0%";
    }


    /* SAVE DATA */

    currentForecastData =
        daily || null;


    currentHourlyData =
        hourly || null;


    updateFavoriteButton();

    displayHourlyForecast(hourly);

    displayForecast(daily);
}


/* =====================================================
   HOURLY FORECAST
===================================================== */

function displayHourlyForecast(hourly) {

    if (!hourlyContainer) {
        return;
    }


    hourlyContainer.innerHTML = "";


    if (
        !hourly ||
        !hourly.time ||
        hourly.time.length === 0
    ) {

        hourlyContainer.innerHTML = `
            <p class="forecast-empty">
                Hourly forecast unavailable.
            </p>
        `;

        return;
    }


    const now =
        new Date();


    let startIndex = 0;


    for (
        let i = 0;
        i < hourly.time.length;
        i++
    ) {

        const hourDate =
            new Date(
                hourly.time[i]
            );


        if (hourDate >= now) {

            startIndex = i;

            break;
        }
    }


    const totalHours =
        Math.min(
            startIndex + 12,
            hourly.time.length
        );


    for (
        let i = startIndex;
        i < totalHours;
        i++
    ) {

        const hourDate =
            new Date(
                hourly.time[i]
            );


        const timeText =
            hourDate.toLocaleTimeString(
                "en-US",
                {
                    hour: "numeric",
                    minute: "2-digit"
                }
            );


        const tempCelsius =
            hourly.temperature_2m[i];


        let displayTemp;


        if (isCelsius) {

            displayTemp =
                Math.round(
                    tempCelsius
                );

        } else {

            displayTemp =
                Math.round(
                    celsiusToFahrenheit(
                        tempCelsius
                    )
                );
        }


        const weatherInfo =
            getWeatherInfo(
                hourly.weather_code[i]
            );


        let rainChance = 0;


        if (
            hourly.precipitation_probability &&
            hourly.precipitation_probability[i] !== undefined
        ) {

            rainChance =
                hourly.precipitation_probability[i];
        }


        const card =
            document.createElement("div");


        card.className =
            "hourly-card";


        card.innerHTML = `
            <div class="hourly-time">
                ${timeText}
            </div>

            <div class="hourly-icon">
                ${weatherInfo.icon}
            </div>

            <div class="hourly-temp">
                ${displayTemp}°
                ${isCelsius ? "C" : "F"}
            </div>

            <div class="hourly-rain">
                💧 ${rainChance}%
            </div>
        `;


        hourlyContainer.appendChild(card);
    }
}


/* =====================================================
   5-DAY FORECAST
===================================================== */

function displayForecast(daily) {

    if (!forecastContainer) {
        return;
    }


    forecastContainer.innerHTML = "";


    if (
        !daily ||
        !daily.time ||
        daily.time.length === 0
    ) {

        forecastContainer.innerHTML = `
            <p class="forecast-empty">
                Forecast unavailable.
            </p>
        `;

        return;
    }


    const totalDays =
        Math.min(
            5,
            daily.time.length
        );


    for (
        let i = 0;
        i < totalDays;
        i++
    ) {

        const date =
            new Date(
                daily.time[i] +
                "T12:00:00"
            );


        const dayName =
            date.toLocaleDateString(
                "en-US",
                {
                    weekday: "short"
                }
            );


        const maxCelsius =
            daily.temperature_2m_max[i];


        const minCelsius =
            daily.temperature_2m_min[i];


        let maxTemp;
        let minTemp;


        if (isCelsius) {

            maxTemp =
                Math.round(
                    maxCelsius
                );

            minTemp =
                Math.round(
                    minCelsius
                );

        } else {

            maxTemp =
                Math.round(
                    celsiusToFahrenheit(
                        maxCelsius
                    )
                );

            minTemp =
                Math.round(
                    celsiusToFahrenheit(
                        minCelsius
                    )
                );
        }


        const weatherInfo =
            getWeatherInfo(
                daily.weather_code[i]
            );


        const card =
            document.createElement("div");


        card.className =
            "forecast-card";


        card.innerHTML = `
            <h3>
                ${dayName}
            </h3>

            <div class="forecast-icon">
                ${weatherInfo.icon}
            </div>

            <div class="forecast-temperature">
                ${maxTemp}° /
                ${minTemp}°
                ${isCelsius ? "C" : "F"}
            </div>

            <div class="forecast-condition">
                ${weatherInfo.text}
            </div>
        `;


        forecastContainer.appendChild(card);
    }
}


/* =====================================================
   SEARCH WEATHER
===================================================== */

async function searchWeather(city) {

    const cleanCity =
        String(city || "").trim();


    if (!cleanCity) {

        alert(
            "Please enter a city name."
        );

        return;
    }


    showLoading(true);


    try {

        /* ===============================
           CITY ALIASES
        ================================ */

        const cityAliases = {

            "sylhrt": "Sylhet",

            "sylhet": "Sylhet",

            "dhaka": "Dhaka",

            "ctg": "Chattogram",

            "chittagong": "Chattogram",

            "cumilla": "Comilla",

            "comilla": "Comilla",

            "rajshahi": "Rajshahi",

            "khulna": "Khulna",

            "barisal": "Barishal",

            "rangpur": "Rangpur",

            "mymensingh": "Mymensingh",

            "coxsbazar": "Cox's Bazar",

            "cox's bazar": "Cox's Bazar"

        };


        const searchCity =
            cityAliases[
                cleanCity.toLowerCase()
            ] || cleanCity;


        /* ===============================
           LOCATION SEARCH
        ================================ */

        const locationUrl =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                searchCity
            )}&count=10&language=en&format=json`;


        const locationResponse =
            await fetch(
                locationUrl
            );


        if (!locationResponse.ok) {

            throw new Error(
                "Location request failed"
            );
        }


        const locationData =
            await locationResponse.json();


        if (
            !locationData.results ||
            locationData.results.length === 0
        ) {

            throw new Error(
                "City not found"
            );
        }


        /* ===============================
           PREFER BANGLADESH
        ================================ */

        const bangladeshResult =
            locationData.results.find(
                function (item) {

                    return (
                        String(
                            item.country_code || ""
                        ).toUpperCase() ===
                        "BD"
                    );
                }
            );


        const location =
            bangladeshResult ||
            locationData.results[0];


        /* ===============================
           WEATHER API
        ================================ */

        const weatherUrl =
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,visibility,surface_pressure&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=auto`;


        const weatherResponse =
            await fetch(
                weatherUrl
            );


        if (!weatherResponse.ok) {

            throw new Error(
                "Weather request failed"
            );
        }


        const weatherData =
            await weatherResponse.json();


        /* ===============================
           DISPLAY
        ================================ */

        displayWeather(
            weatherData.current,
            location.name,
            weatherData.daily,
            weatherData.hourly
        );


        /* ===============================
           HISTORY
        ================================ */

        addToHistory(
            location.name
        );


        /* Update input */

        if (cityInput) {

            cityInput.value =
                location.name;
        }


    } catch (error) {

        console.error(
            "Weather Error:",
            error
        );


        if (
            error.message ===
            "City not found"
        ) {

            alert(
                "City not found. Please try another city."
            );

        } else {

            alert(
                "Something went wrong. Please check your internet connection and try again."
            );
        }


    } finally {

        showLoading(false);
    }
}


/* =====================================================
   SEARCH BUTTON
===================================================== */

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        function () {

            const city =
                cityInput
                    ? cityInput.value.trim()
                    : "";


            searchWeather(city);
        }
    );
}


/* =====================================================
   ENTER KEY
===================================================== */

if (cityInput) {

    cityInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                if (searchBtn) {
                    searchBtn.click();
                }
            }
        }
    );
}


/* =====================================================
   °C / °F BUTTON
===================================================== */

if (unitBtn) {

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
                    celsiusToFahrenheit(
                        currentTemperatureCelsius
                    );


                if (temperature) {

                    temperature.textContent =
                        `${Math.round(
                            fahrenheit
                        )}°F`;
                }


                if (
                    feelsLike &&
                    currentFeelsLikeCelsius !==
                    null
                ) {

                    feelsLike.textContent =
                        `${Math.round(
                            celsiusToFahrenheit(
                                currentFeelsLikeCelsius
                            )
                        )}°F`;
                }


                unitBtn.textContent =
                    "Switch to °C";


                isCelsius = false;


            } else {

                if (temperature) {

                    temperature.textContent =
                        `${Math.round(
                            currentTemperatureCelsius
                        )}°C`;
                }


                if (
                    feelsLike &&
                    currentFeelsLikeCelsius !==
                    null
                ) {

                    feelsLike.textContent =
                        `${Math.round(
                            currentFeelsLikeCelsius
                        )}°C`;
                }


                unitBtn.textContent =
                    "Switch to °F";


                isCelsius = true;
            }


            displayHourlyForecast(
                currentHourlyData
            );


            displayForecast(
                currentForecastData
            );
        }
    );
}


/* =====================================================
   📍 MY LOCATION
===================================================== */

if (locationBtn) {

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


            showLoading(true);


            navigator.geolocation.getCurrentPosition(

                async function (position) {

                    const latitude =
                        position.coords.latitude;


                    const longitude =
                        position.coords.longitude;


                    try {

                        /* ===============================
                           WEATHER
                        ================================ */

                        const weatherUrl =
                            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,visibility,surface_pressure&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=auto`;


                        const weatherResponse =
                            await fetch(
                                weatherUrl
                            );


                        if (
                            !weatherResponse.ok
                        ) {

                            throw new Error(
                                "Weather request failed"
                            );
                        }


                        const weatherData =
                            await weatherResponse.json();


                        /* ===============================
                           LOCATION NAME
                        ================================ */

                        let locationName =
                            "Your Location";


                        try {

                            const locationUrl =
                                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;


                            const locationResponse =
                                await fetch(
                                    locationUrl,
                                    {
                                        headers: {
                                            "Accept":
                                                "application/json"
                                        }
                                    }
                                );


                            if (
                                locationResponse.ok
                            ) {

                                const locationData =
                                    await locationResponse.json();


                                const address =
                                    locationData.address ||
                                    {};


                                locationName =
                                    address.city ||
                                    address.town ||
                                    address.municipality ||
                                    address.village ||
                                    address.county ||
                                    "Your Location";
                            }

                        } catch (locationError) {

                            console.log(
                                "Location name unavailable."
                            );
                        }


                        /* ===============================
                           DISPLAY
                        ================================ */

                        displayWeather(
                            weatherData.current,
                            locationName,
                            weatherData.daily,
                            weatherData.hourly
                        );


                        /* ===============================
                           INPUT
                        ================================ */

                        if (cityInput) {

                            cityInput.value =
                                locationName;
                        }


                        /* ===============================
                           HISTORY
                        ================================ */

                        addToHistory(
                            locationName
                        );


                    } catch (error) {

                        console.error(
                            "Location Weather Error:",
                            error
                        );


                        alert(
                            "Unable to get weather data. Please try again."
                        );

                    } finally {

                        showLoading(false);
                    }
                },


                function (error) {

                    showLoading(false);


                    if (
                        error.code === 1
                    ) {

                        alert(
                            "Please allow location access."
                        );

                    } else if (
                        error.code === 2
                    ) {

                        alert(
                            "Your location could not be detected."
                        );

                    } else if (
                        error.code === 3
                    ) {

                        alert(
                            "Location request timed out. Please try again."
                        );

                    } else {

                        alert(
                            "Unable to get your location."
                        );
                    }
                },


                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        }
    );
}


/* =====================================================
   INITIAL SIDEBAR
===================================================== */

displaySidebar();


/* =====================================================
   OPTIONAL DEFAULT CITY
===================================================== */



searchWeather("Sylhet");