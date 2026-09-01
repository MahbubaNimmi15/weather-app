/* =========================
   NAVBAR
========================= */

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


/* =========================
   SIDEBAR
========================= */

menuBtn.addEventListener(
    "click",
    function () {

        sidebar.classList.add("active");

        overlay.classList.add("active");

    }
);


closeBtn.addEventListener(
    "click",
    function () {

        sidebar.classList.remove("active");

        overlay.classList.remove("active");

    }
);


overlay.addEventListener(
    "click",
    function () {

        sidebar.classList.remove("active");

        overlay.classList.remove("active");

    }
);


/* =========================
   DARK / LIGHT MODE
========================= */

const savedTheme =
    localStorage.getItem("theme");


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


        if (
            document.body.classList.contains(
                "dark-mode"
            )
        ) {

            themeBtn.textContent = "☀️";

            localStorage.setItem(
                "theme",
                "dark"
            );

        } else {

            themeBtn.textContent = "🌙";

            localStorage.setItem(
                "theme",
                "light"
            );

        }

    }
);


/* =========================
   WEATHER ELEMENTS
========================= */

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

const sunrise =
    document.getElementById("sunrise");

const sunset =
    document.getElementById("sunset");

const unitBtn =
    document.getElementById("unitBtn");

const favoriteBtn =
    document.getElementById("favoriteBtn");

const forecastContainer =
    document.getElementById(
        "forecastContainer"
    );

const favoriteList =
    document.getElementById(
        "favoriteList"
    );

const historyList =
    document.getElementById(
        "historyList"
    );

const loading =
    document.getElementById("loading");


/* =========================
   VARIABLES
========================= */

let currentTemperatureCelsius = null;

let isCelsius = true;

let currentCity = "";


/* =========================
   LOCAL STORAGE
========================= */

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


/* =========================
   SIDEBAR DISPLAY
========================= */

function displaySidebar() {

    favoriteList.innerHTML = "";

    historyList.innerHTML = "";


    /* Favorites */

    if (favorites.length === 0) {

        favoriteList.innerHTML =
            `
            <p class="empty-message">
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
                        title="Delete"
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


                cityButton.addEventListener(
                    "click",
                    function () {

                        cityInput.value =
                            city;

                        searchBtn.click();

                        closeSidebar();

                    }
                );


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


                favoriteList.appendChild(
                    item
                );

            }
        );

    }


    /* History */

    if (history.length === 0) {

        historyList.innerHTML =
            `
            <p class="empty-message">
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
                        title="Delete"
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


                cityButton.addEventListener(
                    "click",
                    function () {

                        cityInput.value =
                            city;

                        searchBtn.click();

                        closeSidebar();

                    }
                );


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


                historyList.appendChild(
                    item
                );

            }
        );

    }

}


/* =========================
   CLOSE SIDEBAR
========================= */

function closeSidebar() {

    sidebar.classList.remove(
        "active"
    );

    overlay.classList.remove(
        "active"
    );

}


/* =========================
   ADD HISTORY
========================= */

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


/* =========================
   FAVORITE BUTTON
========================= */

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


/* =========================
   UPDATE FAVORITE
========================= */

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


/* =========================
   WEATHER DISPLAY
========================= */

function displayWeather(
    current,
    city,
    daily
) {

    currentCity = city;


    cityName.textContent =
        city;


    currentTemperatureCelsius =
        current.temperature_2m;


    temperature.textContent =
        `${Math.round(
            currentTemperatureCelsius
        )}°C`;


    isCelsius = true;


    unitBtn.textContent =
        "Switch to °F";


    humidity.textContent =
        `${current.relative_humidity_2m}%`;


    wind.textContent =
        `${Math.round(
            current.wind_speed_10m
        )} km/h`;


    /* Sunrise */

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


    /* Weather Condition */

    const code =
        current.weather_code;


    if (code === 0) {

        condition.textContent =
            "Clear Sky";

        weatherIcon.textContent =
            "☀️";

    } else if (code <= 3) {

        condition.textContent =
            "Partly Cloudy";

        weatherIcon.textContent =
            "⛅";

    } else if (code <= 48) {

        condition.textContent =
            "Foggy";

        weatherIcon.textContent =
            "🌫️";

    } else if (code <= 67) {

        condition.textContent =
            "Rainy";

        weatherIcon.textContent =
            "🌧️";

    } else if (code <= 77) {

        condition.textContent =
            "Snowy";

        weatherIcon.textContent =
            "❄️";

    } else if (code <= 82) {

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


/* =========================
   SEARCH WEATHER
========================= */

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


/* =========================
   FORECAST
========================= */

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


        const code =
            daily.weather_code[i];


        let icon = "☀️";

        let text = "Clear Sky";


        if (code === 0) {

            icon = "☀️";
            text = "Clear Sky";

        } else if (code <= 3) {

            icon = "⛅";
            text = "Cloudy";

        } else if (code <= 48) {

            icon = "🌫️";
            text = "Foggy";

        } else if (code <= 67) {

            icon = "🌧️";
            text = "Rainy";

        } else if (code <= 77) {

            icon = "❄️";
            text = "Snowy";

        } else if (code <= 82) {

            icon = "🌦️";
            text = "Rain Showers";

        } else {

            icon = "⛈️";
            text = "Thunderstorm";

        }


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


/* =========================
   ENTER KEY
========================= */

cityInput.addEventListener(
    "keypress",
    function (event) {

        if (event.key === "Enter") {

            searchBtn.click();

        }

    }
);


/* =========================
   CELSIUS / FAHRENHEIT
========================= */

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
                    9 /
                    5
                ) + 32;


            temperature.textContent =
                `${Math.round(
                    fahrenheit
                )}°F`;


            unitBtn.textContent =
                "Switch to °C";


            isCelsius = false;

        } else {

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


/* =========================
   MY LOCATION
========================= */

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


/* =========================
   INITIAL LOAD
========================= */

displaySidebar();
// ===============================
// MY LOCATION
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

        loading.style.display = "block";

        navigator.geolocation.getCurrentPosition(

            async function (position) {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                try {

                    // Get weather data
                    const weatherResponse =
                        await fetch(
                            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
                        );

                    const weatherData =
                        await weatherResponse.json();


                    // Get city name from coordinates
                    const locationResponse =
                        await fetch(
                            `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=en&format=json`
                        );


                    const locationData =
                        await locationResponse.json();


                    let locationName = "Your Location";


                    if (
                        locationData &&
                        locationData.results &&
                        locationData.results.length > 0
                    ) {

                        const location =
                            locationData.results[0];

                        locationName =
                            location.name ||
                            location.city ||
                            location.town ||
                            location.village ||
                            "Your Location";

                    }


                    // Display weather
                    displayWeather(
                        weatherData.current,
                        locationName,
                        weatherData.daily
                    );


                    // Display forecast
                    displayForecast(
                        weatherData.daily
                    );


                    // Add to search history
                    addToHistory(
                        locationName
                    );


                    loading.style.display = "none";


                } catch (error) {

                    console.error(error);

                    loading.style.display = "none";

                    alert(
                        "Unable to get weather data."
                    );

                }

            },


            function () {

                loading.style.display = "none";

                alert(
                    "Please allow location access."
                );

            }

        );

    }
);