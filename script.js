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

const temperatureChart =
    document.getElementById("temperatureChart");

const aqiValue =
    document.getElementById("aqiValue");

const aqiStatus =
    document.getElementById("aqiStatus");

const pm25 =
    document.getElementById("pm25");

const pm10 =
    document.getElementById("pm10");


/* UV */

const uvValue =
    document.getElementById("uvValue");

const uvStatus =
    document.getElementById("uvStatus");

const uvProgress =
    document.getElementById("uvProgress");

const uvAdvice =
    document.getElementById("uvAdvice");


/* WEATHER ALERTS */

const weatherAlerts =
    document.getElementById("weatherAlerts");


/* =====================================================
   VARIABLES
===================================================== */

let currentWeatherData = null;

let currentAirQualityData = null;

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
   WIND DIRECTION
===================================================== */

function getWindDirection(degrees) {

    if (
        degrees === undefined ||
        degrees === null
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
   LOADING
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
            "precipitation_probability_max," +
            "uv_index_max" +

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


        drawTemperatureGraph(
            data
        );


        displayUVIndex(
            data
        );


        displayWeatherAlerts(
            data
        );


        await loadAirQuality(
            latitude,
            longitude
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


    if (
        data.daily &&
        data.daily.sunrise
    ) {

        sunrise.textContent =
            formatTime(
                data.daily.sunrise[0]
            );

    }


    if (
        data.daily &&
        data.daily.sunset
    ) {

        sunset.textContent =
            formatTime(
                data.daily.sunset[0]
            );

    }


    if (
        data.daily &&
        data.daily.precipitation_probability_max
    ) {

        rainProbability.textContent =
            `${data.daily.precipitation_probability_max[0]}%`;

    }


    if (
        data.hourly &&
        data.hourly.visibility
    ) {

        const index =
            findCurrentHourIndex(
                data.hourly.time
            );


        const nowVisibility =
            data.hourly.visibility[index];


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
        (
            celsius * 9 / 5
        ) + 32;


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


            drawTemperatureGraph(
                currentWeatherData
            );

        }

    }
);


/* =====================================================
   EXTRA TEMPERATURE
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


    const startIndex =
        findCurrentHourIndex(
            hourly.time
        );


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
   🌡️ TEMPERATURE GRAPH
===================================================== */

function drawTemperatureGraph(
    data
) {

    if (
        !temperatureChart ||
        !data.hourly
    ) {
        return;
    }


    const ctx =
        temperatureChart.getContext(
            "2d"
        );


    const rect =
        temperatureChart.getBoundingClientRect();


    const width =
        rect.width;


    const height =
        rect.height;


    const dpr =
        window.devicePixelRatio || 1;


    temperatureChart.width =
        width * dpr;


    temperatureChart.height =
        height * dpr;


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    const hourly =
        data.hourly;


    const startIndex =
        findCurrentHourIndex(
            hourly.time
        );


    const count = 12;


    const endIndex =
        Math.min(
            startIndex + count,
            hourly.time.length
        );


    const temperatures =
        hourly.temperature_2m.slice(
            startIndex,
            endIndex
        );


    const times =
        hourly.time.slice(
            startIndex,
            endIndex
        );


    if (
        temperatures.length === 0
    ) {
        return;
    }


    const padding = 45;


    const graphWidth =
        width - padding * 2;


    const graphHeight =
        height - padding * 2;


    const minTemp =
        Math.min(
            ...temperatures
        ) - 2;


    const maxTemp =
        Math.max(
            ...temperatures
        ) + 2;


    /* GRID */

    ctx.strokeStyle =
        "rgba(255,255,255,0.20)";


    ctx.lineWidth = 1;


    for (
        let i = 0;
        i <= 4;
        i++
    ) {

        const y =
            padding +
            (
                graphHeight / 4
            ) * i;


        ctx.beginPath();


        ctx.moveTo(
            padding,
            y
        );


        ctx.lineTo(
            width - padding,
            y
        );


        ctx.stroke();

    }


    /* TEMPERATURE LINE */

    ctx.beginPath();


    temperatures.forEach(
        (temp, index) => {

            const x =
                padding +
                (
                    index /
                    Math.max(
                        temperatures.length - 1,
                        1
                    )
                ) *
                graphWidth;


            const y =
                padding +
                (
                    1 -
                    (
                        temp - minTemp
                    ) /
                    (
                        maxTemp - minTemp
                    )
                ) *
                graphHeight;


            if (index === 0) {

                ctx.moveTo(
                    x,
                    y
                );

            } else {

                ctx.lineTo(
                    x,
                    y
                );

            }

        }
    );


    ctx.strokeStyle =
        "#ffffff";


    ctx.lineWidth = 3;


    ctx.stroke();


    /* POINTS */

    temperatures.forEach(
        (temp, index) => {

            const x =
                padding +
                (
                    index /
                    Math.max(
                        temperatures.length - 1,
                        1
                    )
                ) *
                graphWidth;


            const y =
                padding +
                (
                    1 -
                    (
                        temp - minTemp
                    ) /
                    (
                        maxTemp - minTemp
                    )
                ) *
                graphHeight;


            ctx.beginPath();


            ctx.arc(
                x,
                y,
                5,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                "#ffffff";


            ctx.fill();


            ctx.font =
                "12px Arial";


            ctx.fillStyle =
                "#ffffff";


            ctx.textAlign =
                "center";


            ctx.fillText(
                formatTemperature(
                    temp
                ),
                x,
                y - 10
            );


            ctx.font =
                "11px Arial";


            ctx.fillText(
                formatTime(
                    times[index]
                ),
                x,
                height - 15
            );

        }
    );

}


/* =====================================================
   FIND CURRENT HOUR
===================================================== */

function findCurrentHourIndex(
    times
) {

    const now =
        new Date();


    for (
        let i = 0;
        i < times.length;
        i++
    ) {

        if (
            new Date(
                times[i]
            ) >= now
        ) {

            return i;

        }

    }


    return 0;

}


/* =====================================================
   WINDOW RESIZE GRAPH
===================================================== */

window.addEventListener(
    "resize",
    () => {

        if (
            currentWeatherData
        ) {

            drawTemperatureGraph(
                currentWeatherData
            );

        }

    }
);


/* =====================================================
   🌬️ AIR QUALITY
===================================================== */

async function loadAirQuality(
    latitude,
    longitude
) {

    try {

        const url =
            "https://air-quality-api.open-meteo.com/v1/air-quality" +

            "?latitude=" +
            latitude +

            "&longitude=" +
            longitude +

            "&current=" +
            "european_aqi," +
            "pm10," +
            "pm2_5" +

            "&timezone=auto";


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Air quality request failed"
            );

        }


        const data =
            await response.json();


        currentAirQualityData =
            data;


        displayAirQuality(
            data
        );


    } catch (error) {

        console.error(error);


        aqiValue.textContent =
            "--";


        aqiStatus.textContent =
            "Unavailable";


        pm25.textContent =
            "-- µg/m³";


        pm10.textContent =
            "-- µg/m³";

    }

}


/* =====================================================
   DISPLAY AIR QUALITY
===================================================== */

function displayAirQuality(
    data
) {

    if (
        !data.current
    ) {
        return;
    }


    const current =
        data.current;


    const aqi =
        current.european_aqi;


    const pm25Value =
        current.pm2_5;


    const pm10Value =
        current.pm10;


    aqiValue.textContent =
        aqi !== undefined &&
        aqi !== null
            ? Math.round(aqi)
            : "--";


    pm25.textContent =
        pm25Value !== undefined &&
        pm25Value !== null
            ? `${pm25Value.toFixed(1)} µg/m³`
            : "-- µg/m³";


    pm10.textContent =
        pm10Value !== undefined &&
        pm10Value !== null
            ? `${pm10Value.toFixed(1)} µg/m³`
            : "-- µg/m³";


    aqiStatus.textContent =
        getAQIStatus(
            aqi
        );

}


/* =====================================================
   AQI STATUS
===================================================== */

function getAQIStatus(
    aqi
) {

    if (
        aqi === undefined ||
        aqi === null
    ) {

        return "Unavailable";

    }


    if (aqi <= 20) {
        return "🟢 Good";
    }


    if (aqi <= 40) {
        return "🟡 Fair";
    }


    if (aqi <= 60) {
        return "🟠 Moderate";
    }


    if (aqi <= 80) {
        return "🔴 Poor";
    }


    if (aqi <= 100) {
        return "🟣 Very Poor";
    }


    return "⚠️ Extremely Poor";

}


/* =====================================================
   ☀️ UV INDEX
===================================================== */

function displayUVIndex(
    data
) {

    if (
        !data.daily ||
        !data.daily.uv_index_max
    ) {

        uvValue.textContent =
            "--";

        uvStatus.textContent =
            "Unavailable";

        uvAdvice.textContent =
            "UV information is unavailable.";

        uvProgress.style.width =
            "0%";

        return;

    }


    const uv =
        data.daily.uv_index_max[0];


    if (
        uv === undefined ||
        uv === null
    ) {

        return;

    }


    uvValue.textContent =
        uv.toFixed(1);


    const status =
        getUVStatus(
            uv
        );


    uvStatus.textContent =
        status.text;


    uvAdvice.textContent =
        status.advice;


    const progress =
        Math.min(
            (uv / 12) * 100,
            100
        );


    uvProgress.style.width =
        `${progress}%`;

}


/* =====================================================
   UV STATUS
===================================================== */

function getUVStatus(
    uv
) {

    if (uv < 3) {

        return {

            text: "🟢 Low",

            advice:
                "Low UV risk. Normal outdoor activities are generally fine."

        };

    }


    if (uv < 6) {

        return {

            text: "🟡 Moderate",

            advice:
                "Moderate UV risk. Consider shade and sun protection during longer outdoor activities."

        };

    }


    if (uv < 8) {

        return {

            text: "🟠 High",

            advice:
                "High UV risk. Use shade, protective clothing and sunscreen when outdoors."

        };

    }


    if (uv < 11) {

        return {

            text: "🔴 Very High",

            advice:
                "Very high UV risk. Minimize direct sun exposure and use sun protection."

        };

    }


    return {

        text: "🟣 Extreme",

        advice:
            "Extreme UV risk. Avoid prolonged direct sun exposure and use strong sun protection."

    };

}


/* =====================================================
   🌧️ WEATHER ALERTS
===================================================== */

function displayWeatherAlerts(
    data
) {

    weatherAlerts.innerHTML =
        "";


    if (
        !data.current
    ) {

        showNoAlert();

        return;

    }


    const current =
        data.current;


    const alerts = [];


    const weatherCode =
        current.weather_code;


    const windSpeed =
        current.wind_speed_10m || 0;


    const windGustsValue =
        current.wind_gusts_10m || 0;


    const rain =
        current.rain || 0;


    const precipitation =
        current.precipitation || 0;


    const dailyRain =
        data.daily &&
        data.daily.precipitation_probability_max
            ? data.daily.precipitation_probability_max[0]
            : 0;


    const uv =
        data.daily &&
        data.daily.uv_index_max
            ? data.daily.uv_index_max[0]
            : 0;


    /* THUNDERSTORM */

    if (
        weatherCode === 95 ||
        weatherCode === 96 ||
        weatherCode === 99
    ) {

        alerts.push({

            icon: "⛈️",

            title:
                "Thunderstorm Alert",

            description:
                "Thunderstorm conditions are currently reported. Consider staying indoors and avoiding exposed outdoor areas."

        });

    }


    /* HEAVY RAIN */

    if (
        weatherCode === 65 ||
        weatherCode === 82 ||
        rain >= 5 ||
        precipitation >= 5 ||
        dailyRain >= 80
    ) {

        alerts.push({

            icon: "🌧️",

            title:
                "Heavy Rain Alert",

            description:
                `Heavy rain is possible. Current rain: ${rain.toFixed(1)} mm. Today's rain probability: ${dailyRain}%.`

        });

    }


    /* HIGH WIND */

    if (
        windSpeed >= 40 ||
        windGustsValue >= 50
    ) {

        alerts.push({

            icon: "💨",

            title:
                "High Wind Alert",

            description:
                `Strong winds detected. Wind speed: ${Math.round(windSpeed)} km/h, gusts: ${Math.round(windGustsValue)} km/h.`

        });

    }


    /* HIGH UV */

    if (
        uv >= 6
    ) {

        alerts.push({

            icon: "☀️",

            title:
                "High UV Alert",

            description:
                `Today's maximum UV Index is ${uv.toFixed(1)}. Use appropriate sun protection during outdoor activities.`

        });

    }


    if (
        alerts.length === 0
    ) {

        showNoAlert();

        return;

    }


    alerts.forEach(
        alert => {

            const alertBox =
                document.createElement(
                    "div"
                );


            alertBox.className =
                "weather-alert";


            alertBox.innerHTML = `

                <div class="alert-icon">
                    ${alert.icon}
                </div>

                <div class="alert-content">

                    <div class="alert-title">
                        ${alert.title}
                    </div>

                    <div class="alert-description">
                        ${alert.description}
                    </div>

                </div>

            `;


            weatherAlerts.appendChild(
                alertBox
            );

        }
    );

}


/* =====================================================
   NO ALERT
===================================================== */

function showNoAlert() {

    weatherAlerts.innerHTML = `

        <div class="no-alert">
            ✅ No active weather alerts
        </div>

    `;

}


/* =====================================================
   SEARCH BUTTON
===================================================== */

searchBtn.addEventListener(
    "click",
    () => {

        const city =
            cityInput.value.trim();


        if (
            city !== ""
        ) {

            searchCity(
                city
            );

        }

    }
);


/* =====================================================
   ENTER SEARCH
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


            if (
                city !== ""
            ) {

                searchCity(
                    city
                );

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
            encodeURIComponent(
                query
            ) +

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


                        searchSuggestions.innerHTML =
                            "";


                        searchSuggestions.classList.remove(
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


                searchSuggestions.appendChild(
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
   CLICK OUTSIDE
===================================================== */

document.addEventListener(
    "click",
    (event) => {

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
   📍 MY LOCATION
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

                    /*
                       Open-Meteo geocoding search
                       is used as a best-effort city label.
                    */

                    let name =
                        "My Location";


                    let country =
                        "";


                    await loadWeather(

                        latitude,

                        longitude,

                        name,

                        country

                    );


                } catch (error) {

                    console.error(error);


                    alert(
                        "❌ Could not load your location weather."
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

        if (
            !currentCity
        ) {
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
   INITIALIZE APP
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