/* =====================================================
   🌤️ WEATHER APP - COMPLETE JAVASCRIPT
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

const searchSuggestions =
    document.getElementById("searchSuggestions");

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

let suggestionTimer = null;


/* =====================================================
   LOCAL STORAGE
===================================================== */

let favorites =
    JSON.parse(
        localStorage.getItem("favoriteCities")
    ) || [];

let history =
    JSON.parse(
        localStorage.getItem("searchHistory")
    ) || [];


/* =====================================================
   SIDEBAR
===================================================== */

function openSidebar() {

    sidebar.classList.add("active");
    overlay.classList.add("active");
}


function closeSidebar() {

    sidebar.classList.remove("active");
    overlay.classList.remove("active");
}


menuBtn.addEventListener(
    "click",
    openSidebar
);


closeBtn.addEventListener(
    "click",
    closeSidebar
);


overlay.addEventListener(
    "click",
    closeSidebar
);


/* =====================================================
   DARK / LIGHT MODE
===================================================== */

const savedTheme =
    localStorage.getItem("weatherTheme");


if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    themeBtn.textContent = "☀️";

} else {

    themeBtn.textContent = "🌙";
}


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


/* =====================================================
   CITY ALIASES
   Short names → Actual city names
===================================================== */

const cityAliases = {

    "ctg": "Chattogram",
    "chittagong": "Chattogram",

    "syl": "Sylhet",
    "sylh": "Sylhet",
    "sylhrt": "Sylhet",

    "dhk": "Dhaka",

    "com": "Cumilla",
    "cum": "Cumilla",

    "cox": "Cox's Bazar",

    "raj": "Rajshahi",

    "khul": "Khulna",

    "bar": "Barishal",

    "ran": "Rangpur",

    "mym": "Mymensingh"

};


/* =====================================================
   SEARCH SUGGESTIONS
===================================================== */

cityInput.addEventListener(
    "input",
    function () {

        const value =
            cityInput.value.trim();


        clearTimeout(suggestionTimer);


        if (value.length < 2) {

            searchSuggestions.innerHTML = "";

            searchSuggestions.classList.remove(
                "show"
            );

            return;
        }


        /*
         * Small delay prevents too many API requests
         */

        suggestionTimer =
            setTimeout(
                function () {

                    loadSuggestions(value);

                },
                350
            );
    }
);


/* =====================================================
   LOAD CITY SUGGESTIONS
===================================================== */

async function loadSuggestions(value) {

    try {

        searchSuggestions.innerHTML = `
            <div class="suggestion-loading">
                🔍 Searching cities...
            </div>
        `;

        searchSuggestions.classList.add(
            "show"
        );


        /*
         * Check alias first
         */

        const lowerValue =
            value.toLowerCase();


        const alias =
            cityAliases[lowerValue];


        const searchValue =
            alias || value;


        /*
         * Open-Meteo Geocoding API
         *
         * No countryCode restriction here.
         * Therefore any city in the world can appear.
         */

        const response =
            await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                    searchValue
                )}&count=8&language=en&format=json`
            );


        if (!response.ok) {

            throw new Error(
                "Suggestion request failed"
            );
        }


        const data =
            await response.json();


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


        /*
         * Remove duplicate cities
         */

        const uniqueCities = [];

        data.results.forEach(
            function (item) {

                const key =
                    `${item.name}-${item.country_code}`;


                if (
                    !uniqueCities.some(
                        function (city) {
                            return city.key === key;
                        }
                    )
                ) {

                    uniqueCities.push({
                        key: key,
                        data: item
                    });
                }
            }
        );


        searchSuggestions.innerHTML = "";


        /*
         * Bangladesh results first
         */

        uniqueCities.sort(
            function (a, b) {

                const aBD =
                    a.data.country_code === "BD";

                const bBD =
                    b.data.country_code === "BD";


                if (aBD && !bBD) {
                    return -1;
                }

                if (!aBD && bBD) {
                    return 1;
                }

                return 0;
            }
        );


        uniqueCities.forEach(
            function (cityObject) {

                const city =
                    cityObject.data;


                const item =
                    document.createElement("button");


                item.type = "button";

                item.className =
                    "suggestion-item";


                const cityText =
                    city.name || "Unknown City";


                const countryText =
                    city.country || "";


                const adminText =
                    city.admin1 || "";


                item.innerHTML = `
                    <span class="suggestion-icon">
                        📍
                    </span>

                    <span class="suggestion-text">
                        <strong>
                            ${cityText}
                        </strong>

                        <small>
                            ${adminText
                                ? adminText + ", "
                                : ""
                            }${countryText}
                        </small>
                    </span>
                `;


                /*
                 * CLICK SUGGESTION
                 */

                item.addEventListener(
                    "click",
                    function () {

                        cityInput.value =
                            cityText;


                        searchSuggestions.innerHTML =
                            "";

                        searchSuggestions.classList.remove(
                            "show"
                        );


                        /*
                         * Directly search selected city
                         */

                        searchWeather(
                            cityText
                        );
                    }
                );


                searchSuggestions.appendChild(
                    item
                );
            }
        );


    } catch (error) {

        console.error(
            "Suggestion Error:",
            error
        );


        searchSuggestions.innerHTML = `
            <div class="no-suggestion">
                ⚠️ Unable to load suggestions
            </div>
        `;
    }
}


/* =====================================================
   CLOSE SUGGESTIONS WHEN CLICKING OUTSIDE
===================================================== */

document.addEventListener(
    "click",
    function (event) {

        if (
            !event.target.closest(
                ".search-wrapper"
            )
        ) {

            searchSuggestions.classList.remove(
                "show"
            );
        }
    }
);


/* =====================================================
   DISPLAY SIDEBAR
===================================================== */

function displaySidebar() {

    favoriteList.innerHTML = "";
    historyList.innerHTML = "";


    /* FAVORITES */

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


                item.querySelector(
                    ".city-button"
                ).addEventListener(
                    "click",
                    function () {

                        cityInput.value =
                            city;

                        closeSidebar();

                        searchWeather(
                            city
                        );
                    }
                );


                item.querySelector(
                    ".delete-btn"
                ).addEventListener(
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


    /* HISTORY */

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


                item.querySelector(
                    ".city-button"
                ).addEventListener(
                    "click",
                    function () {

                        cityInput.value =
                            city;

                        closeSidebar();

                        searchWeather(
                            city
                        );
                    }
                );


                item.querySelector(
                    ".delete-btn"
                ).addEventListener(
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


/* =====================================================
   SEARCH HISTORY
===================================================== */

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


/* =====================================================
   FAVORITE
===================================================== */

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
            JSON.stringify(
                favorites
            )
        );


        displaySidebar();

        updateFavoriteButton();
    }
);


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


    if (weatherCode <= 3) {

        return {
            icon: "⛅",
            text: "Partly Cloudy"
        };
    }


    if (weatherCode <= 48) {

        return {
            icon: "🌫️",
            text: "Foggy"
        };
    }


    if (weatherCode <= 67) {

        return {
            icon: "🌧️",
            text: "Rainy"
        };
    }


    if (weatherCode <= 77) {

        return {
            icon: "❄️",
            text: "Snowy"
        };
    }


    if (weatherCode <= 82) {

        return {
            icon: "🌦️",
            text: "Rain Showers"
        };
    }


    return {
        icon: "⛈️",
        text: "Thunderstorm"
    };
}


/* =====================================================
   WIND DIRECTION
===================================================== */

function getWindDirection(degrees) {

    if (
        degrees === null ||
        degrees === undefined
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
        Math.round(
            degrees / 45
        ) % 8;


    return directions[index];
}


/* =====================================================
   CELSIUS → FAHRENHEIT
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

    currentCity = city;

    cityName.textContent = city;


    /* TEMPERATURE */

    currentTemperatureCelsius =
        current.temperature_2m;


    currentFeelsLikeCelsius =
        current.apparent_temperature;


    isCelsius = true;


    temperature.textContent =
        `${Math.round(
            currentTemperatureCelsius
        )}°C`;


    unitBtn.textContent =
        "Switch to °F";


    /* HUMIDITY */

    humidity.textContent =
        `${current.relative_humidity_2m}%`;


    /* WIND */

    wind.textContent =
        `${Math.round(
            current.wind_speed_10m
        )} km/h`;


    /* SUNRISE / SUNSET */

    if (
        daily &&
        daily.sunrise &&
        daily.sunset
    ) {

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


    /* CONDITION */

    const weatherInfo =
        getWeatherInfo(
            current.weather_code
        );


    condition.textContent =
        weatherInfo.text;


    weatherIcon.textContent =
        weatherInfo.icon;


    /* FEELS LIKE */

    if (
        current.apparent_temperature !==
        undefined
    ) {

        feelsLike.textContent =
            `${Math.round(
                current.apparent_temperature
            )}°C`;
    }


    /* VISIBILITY */

    if (
        current.visibility !==
        undefined
    ) {

        visibility.textContent =
            `${(
                current.visibility / 1000
            ).toFixed(1)} km`;
    }


    /* PRESSURE */

    if (
        current.surface_pressure !==
        undefined
    ) {

        pressure.textContent =
            `${Math.round(
                current.surface_pressure
            )} hPa`;
    }


    /* WIND DIRECTION */

    if (
        current.wind_direction_10m !==
        undefined
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
        current.wind_gusts_10m !==
        undefined
    ) {

        windGusts.textContent =
            `${Math.round(
                current.wind_gusts_10m
            )} km/h`;
    }


    /* RAIN */

    if (
        daily &&
        daily.precipitation_probability_max
    ) {

        rainProbability.textContent =
            `${daily.precipitation_probability_max[0]}%`;

    } else {

        rainProbability.textContent =
            "0%";
    }


    /* SAVE */

    currentForecastData =
        daily;

    currentHourlyData =
        hourly;


    updateFavoriteButton();

    displayHourlyForecast(hourly);

    displayForecast(daily);
}


/* =====================================================
   HOURLY FORECAST
===================================================== */

function displayHourlyForecast(hourly) {

    hourlyContainer.innerHTML = "";


    if (
        !hourly ||
        !hourly.time
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


        if (
            hourDate >= now
        ) {

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
            hourly.precipitation_probability
        ) {

            rainChance =
                hourly.precipitation_probability[i] || 0;
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


        hourlyContainer.appendChild(
            card
        );
    }
}


/* =====================================================
   5-DAY FORECAST
===================================================== */

function displayForecast(daily) {

    forecastContainer.innerHTML = "";


    if (
        !daily ||
        !daily.time
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


        forecastContainer.appendChild(
            card
        );
    }
}


/* =====================================================
   SEARCH WEATHER
===================================================== */

async function searchWeather(city) {

    if (!city) {

        alert(
            "Please enter a city name."
        );

        return;
    }


    loading.style.display =
        "block";


    searchSuggestions.classList.remove(
        "show"
    );


    try {

        /*
         * Convert short aliases
         */

        const cleanCity =
            city.trim();


        const lowerCity =
            cleanCity.toLowerCase();


        const searchCity =
            cityAliases[lowerCity] ||
            cleanCity;


        /*
         * GEOCODING
         *
         * No country restriction.
         * So worldwide cities work.
         */

        const locationResponse =
            await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                    searchCity
                )}&count=10&language=en&format=json`
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


        /*
         * Prefer Bangladesh if available.
         * Otherwise use first result.
         */

        const location =
            locationData.results.find(
                function (item) {

                    return (
                        item.country_code ===
                        "BD"
                    );
                }
            ) ||
            locationData.results[0];


        /*
         * WEATHER API
         */

        const weatherResponse =
            await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,visibility,surface_pressure&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=auto`
            );


        if (!weatherResponse.ok) {

            throw new Error(
                "Weather request failed"
            );
        }


        const weatherData =
            await weatherResponse.json();


        /*
         * Display weather
         */

        displayWeather(
            weatherData.current,
            location.name,
            weatherData.daily,
            weatherData.hourly
        );


        /*
         * Add history
         */

        addToHistory(
            location.name
        );


        /*
         * Put selected city into input
         */

        cityInput.value =
            location.name;


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

        loading.style.display =
            "none";
    }
}


/* =====================================================
   SEARCH BUTTON
===================================================== */

searchBtn.addEventListener(
    "click",
    function () {

        const city =
            cityInput.value.trim();


        searchWeather(city);
    }
);


/* =====================================================
   ENTER KEY
===================================================== */

cityInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            searchSuggestions.classList.remove(
                "show"
            );

            searchBtn.click();
        }
    }
);


/* =====================================================
   °C / °F
===================================================== */

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


            temperature.textContent =
                `${Math.round(
                    fahrenheit
                )}°F`;


            if (
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

            temperature.textContent =
                `${Math.round(
                    currentTemperatureCelsius
                )}°C`;


            if (
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


/* =====================================================
   📍 MY LOCATION
===================================================== */

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

                    /*
                     * Weather
                     */

                    const weatherResponse =
                        await fetch(
                            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,visibility,surface_pressure&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=auto`
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


                    /*
                     * Location name
                     */

                    let locationName =
                        "Your Location";


                    try {

                        const locationResponse =
                            await fetch(
                                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
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


                    /*
                     * Display
                     */

                    displayWeather(
                        weatherData.current,
                        locationName,
                        weatherData.daily,
                        weatherData.hourly
                    );


                    /*
                     * Input update
                     */

                    cityInput.value =
                        locationName;


                    /*
                     * History
                     */

                    addToHistory(
                        locationName
                    );


                } catch (error) {

                    console.error(
                        error
                    );


                    alert(
                        "Unable to get weather data. Please try again."
                    );

                } finally {

                    loading.style.display =
                        "none";
                }

            },


            function (error) {

                loading.style.display =
                    "none";


                if (
                    error.code === 1
                ) {

                    alert(
                        "Please allow location access."
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


/* =====================================================
   INITIAL SIDEBAR
===================================================== */

displaySidebar();