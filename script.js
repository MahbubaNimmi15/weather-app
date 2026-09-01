/* ===============================
   ELEMENTS
=============================== */

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

const favoriteList =
    document.getElementById("favoriteList");

const historyList =
    document.getElementById("historyList");

const loading =
    document.getElementById("loading");


/* ===============================
   VARIABLES
=============================== */

let currentTemperatureCelsius = null;
let isCelsius = true;
let currentCity = "";


/* ===============================
   LOCAL STORAGE
=============================== */

let favorites =
    JSON.parse(
        localStorage.getItem("favoriteCities")
    ) || [];

let history =
    JSON.parse(
        localStorage.getItem("searchHistory")
    ) || [];


/* ===============================
   SIDEBAR
=============================== */

function openSidebar() {
    sidebar.classList.add("active");
    overlay.classList.add("active");
}

function closeSidebar() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
}

menuBtn.addEventListener("click", openSidebar);

closeBtn.addEventListener("click", closeSidebar);

overlay.addEventListener("click", closeSidebar);


/* ===============================
   DARK / LIGHT MODE
=============================== */

const savedTheme =
    localStorage.getItem("weatherTheme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeBtn.textContent = "☀️";
} else {
    themeBtn.textContent = "🌙";
}

themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    const isDark =
        document.body.classList.contains("dark-mode");

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
});


/* ===============================
   DISPLAY SIDEBAR
=============================== */

function displaySidebar() {

    favoriteList.innerHTML = "";
    historyList.innerHTML = "";


    /* FAVORITES */

    if (favorites.length === 0) {

        favoriteList.innerHTML =
            `<p class="empty-message">
                No favorite cities
            </p>`;

    } else {

        favorites.forEach(function (city, index) {

            const item =
                document.createElement("div");

            item.className = "sidebar-item";

            item.innerHTML = `
                <button class="city-button">
                    ⭐ ${city}
                </button>

                <button
                    class="delete-btn"
                    title="Delete favorite"
                >
                    🗑️
                </button>
            `;

            item.querySelector(
                ".city-button"
            ).addEventListener("click", function () {

                cityInput.value = city;

                closeSidebar();

                searchWeather(city);
            });


            item.querySelector(
                ".delete-btn"
            ).addEventListener("click", function () {

                favorites.splice(index, 1);

                localStorage.setItem(
                    "favoriteCities",
                    JSON.stringify(favorites)
                );

                displaySidebar();

                updateFavoriteButton();
            });

            favoriteList.appendChild(item);
        });
    }


    /* SEARCH HISTORY */

    if (history.length === 0) {

        historyList.innerHTML =
            `<p class="empty-message">
                No search history
            </p>`;

    } else {

        history.forEach(function (city, index) {

            const item =
                document.createElement("div");

            item.className = "sidebar-item";

            item.innerHTML = `
                <button class="city-button">
                    🕘 ${city}
                </button>

                <button
                    class="delete-btn"
                    title="Delete history"
                >
                    🗑️
                </button>
            `;


            item.querySelector(
                ".city-button"
            ).addEventListener("click", function () {

                cityInput.value = city;

                closeSidebar();

                searchWeather(city);
            });


            item.querySelector(
                ".delete-btn"
            ).addEventListener("click", function () {

                history.splice(index, 1);

                localStorage.setItem(
                    "searchHistory",
                    JSON.stringify(history)
                );

                displaySidebar();
            });

            historyList.appendChild(item);
        });
    }
}


/* ===============================
   ADD SEARCH HISTORY
=============================== */

function addToHistory(city) {

    history =
        history.filter(function (item) {

            return (
                item.toLowerCase() !==
                city.toLowerCase()
            );
        });

    history.unshift(city);

    history = history.slice(0, 10);

    localStorage.setItem(
        "searchHistory",
        JSON.stringify(history)
    );

    displaySidebar();
}


/* ===============================
   FAVORITE BUTTON
=============================== */

favoriteBtn.addEventListener(
    "click",
    function () {

        if (!currentCity) {
            return;
        }

        const index =
            favorites.findIndex(function (city) {

                return (
                    city.toLowerCase() ===
                    currentCity.toLowerCase()
                );
            });


        if (index === -1) {

            favorites.push(currentCity);

        } else {

            favorites.splice(index, 1);
        }


        localStorage.setItem(
            "favoriteCities",
            JSON.stringify(favorites)
        );

        displaySidebar();

        updateFavoriteButton();
    }
);


/* ===============================
   UPDATE FAVORITE BUTTON
=============================== */

function updateFavoriteButton() {

    const exists =
        favorites.some(function (city) {

            return (
                city.toLowerCase() ===
                currentCity.toLowerCase()
            );
        });


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


/* ===============================
   WEATHER INFORMATION
=============================== */

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


/* ===============================
   DISPLAY WEATHER
=============================== */

function displayWeather(
    current,
    city,
    daily
) {

    currentCity = city;

    cityName.textContent = city;


    /* IMPORTANT:
       Always save Celsius temperature
    */

    currentTemperatureCelsius =
        Number(current.temperature_2m);


    /* Start in Celsius */

    isCelsius = true;

    temperature.textContent =
        `${Math.round(
            currentTemperatureCelsius
        )}°C`;

    unitBtn.textContent =
        "Switch to °F";


    humidity.textContent =
        `${current.relative_humidity_2m}%`;


    wind.textContent =
        `${Math.round(
            current.wind_speed_10m
        )} km/h`;


    /* SUNRISE */

    if (
        daily &&
        daily.sunrise &&
        daily.sunrise.length > 0
    ) {

        const sunriseTime =
            new Date(daily.sunrise[0]);

        sunrise.textContent =
            sunriseTime.toLocaleTimeString(
                "en-US",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );
    }


    /* SUNSET */

    if (
        daily &&
        daily.sunset &&
        daily.sunset.length > 0
    ) {

        const sunsetTime =
            new Date(daily.sunset[0]);

        sunset.textContent =
            sunsetTime.toLocaleTimeString(
                "en-US",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );
    }


    /* WEATHER CONDITION */

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


/* ===============================
   SEARCH WEATHER
=============================== */

async function searchWeather(city) {

    if (!city) {

        alert(
            "Please enter a city name."
        );

        return;
    }


    loading.style.display = "block";


    try {

        /* GET LOCATION */

        const locationResponse =
            await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
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


        const location =
            locationData.results[0];


        /* GET WEATHER */

        const weatherResponse =
            await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
            );


        if (!weatherResponse.ok) {

            throw new Error(
                "Weather request failed"
            );
        }


        const weatherData =
            await weatherResponse.json();


        /* DISPLAY */

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


    } catch (error) {

        console.error(error);

        if (
            error.message ===
            "City not found"
        ) {

            alert(
                "City not found. Please try another city."
            );

        } else {

            alert(
                "Something went wrong. Please try again."
            );
        }

    } finally {

        loading.style.display = "none";
    }
}


/* ===============================
   SEARCH BUTTON
=============================== */

searchBtn.addEventListener(
    "click",
    function () {

        const city =
            cityInput.value.trim();

        searchWeather(city);
    }
);


/* ===============================
   ENTER KEY
=============================== */

cityInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            searchBtn.click();
        }
    }
);


/* ===============================
   5 DAY FORECAST
=============================== */

function displayForecast(daily) {

    forecastContainer.innerHTML = "";


    if (
        !daily ||
        !daily.time
    ) {

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
            document.createElement("div");

        card.className =
            "forecast-card";


        card.innerHTML = `
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


        forecastContainer.appendChild(card);
    }
}


/* ===============================
   CELSIUS / FAHRENHEIT
=============================== */

unitBtn.addEventListener(
    "click",
    function () {

        /* No weather loaded */

        if (
            currentTemperatureCelsius === null
        ) {
            alert(
                "Please search for a city first."
            );

            return;
        }


        /* CELSIUS → FAHRENHEIT */

        if (isCelsius) {

            const fahrenheit =
                (
                    currentTemperatureCelsius *
                    9 / 5
                ) + 32;


            temperature.textContent =
                `${Math.round(
                    fahrenheit
                )}°F`;


            unitBtn.textContent =
                "Switch to °C";


            isCelsius = false;


        }

        /* FAHRENHEIT → CELSIUS */

        else {

            temperature.textContent =
                `${Math.round(
                    currentTemperatureCelsius
                )}°C`;


            unitBtn.textContent =
                "Switch to °F";


            isCelsius = true;
        }
    }
);


/* ===============================
   MY LOCATION
=============================== */

locationBtn.addEventListener(
    "click",
    function () {

        if (!navigator.geolocation) {

            alert(
                "Geolocation is not supported by your browser."
            );

            return;
        }


        loading.style.display = "block";


        navigator.geolocation.getCurrentPosition(

            async function (position) {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;


                try {

                    /* GET WEATHER */

                    const weatherResponse =
                        await fetch(
                            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
                        );


                    if (!weatherResponse.ok) {

                        throw new Error(
                            "Weather request failed"
                        );
                    }


                    const weatherData =
                        await weatherResponse.json();


                    /* GET CITY NAME */

                    const locationResponse =
                        await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
                        );


                    let locationName =
                        "Your Location";


                    if (
                        locationResponse.ok
                    ) {

                        const locationData =
                            await locationResponse.json();


                        const address =
                            locationData.address || {};


                        locationName =
                            address.city ||
                            address.town ||
                            address.municipality ||
                            address.village ||
                            address.county ||
                            "Your Location";
                    }


                    /* DISPLAY */

                    displayWeather(
                        weatherData.current,
                        locationName,
                        weatherData.daily
                    );


                    displayForecast(
                        weatherData.daily
                    );


                    addToHistory(
                        locationName
                    );


                } catch (error) {

                    console.error(error);

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


/* ===============================
   INITIAL SIDEBAR
=============================== */

displaySidebar();