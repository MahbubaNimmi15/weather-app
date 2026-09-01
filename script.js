
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
const forecastContainer = document.getElementById("forecastContainer");
const loading = document.getElementById("loading");

const favoriteBtn = document.getElementById("favoriteBtn");

const favoriteCities = document.getElementById("favoriteCities");
const searchHistory = document.getElementById("searchHistory");

const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");


let currentTemperatureCelsius = null;
let isCelsius = true;

let currentCity = "Dhaka";


// ===============================
// LOCAL STORAGE
// ===============================

let favorites =
    JSON.parse(localStorage.getItem("favoriteCities")) || [];

let history =
    JSON.parse(localStorage.getItem("searchHistory")) || [];


// ===============================
// SIDEBAR
// ===============================

menuBtn.addEventListener("click", function () {

    sidebar.classList.add("active");
    overlay.classList.add("active");

});


closeBtn.addEventListener("click", closeSidebar);

overlay.addEventListener("click", closeSidebar);


function closeSidebar() {

    sidebar.classList.remove("active");
    overlay.classList.remove("active");

}


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

    if (daily && daily.sunrise && daily.sunset) {

        const sunriseTime =
            new Date(daily.sunrise[0]);

        const sunsetTime =
            new Date(daily.sunset[0]);


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


    // Weather Condition

    const weatherCode =
        current.weather_code;


    if (weatherCode === 0) {

        condition.textContent =
            "Clear Sky";

        weatherIcon.textContent =
            "☀️";

    }

    else if (weatherCode <= 3) {

        condition.textContent =
            "Partly Cloudy";

        weatherIcon.textContent =
            "⛅";

    }

    else if (weatherCode <= 48) {

        condition.textContent =
            "Foggy";

        weatherIcon.textContent =
            "🌫️";

    }

    else if (weatherCode <= 67) {

        condition.textContent =
            "Rainy";

        weatherIcon.textContent =
            "🌧️";

    }

    else if (weatherCode <= 77) {

        condition.textContent =
            "Snowy";

        weatherIcon.textContent =
            "❄️";

    }

    else if (weatherCode <= 82) {

        condition.textContent =
            "Rain Showers";

        weatherIcon.textContent =
            "🌦️";

    }

    else {

        condition.textContent =
            "Thunderstorm";

        weatherIcon.textContent =
            "⛈️";

    }


    updateFavoriteButton();

}


// ===============================
// SEARCH WEATHER
// ===============================

searchBtn.addEventListener(
    "click",
    searchWeather
);


async function searchWeather() {

    const city =
        cityInput.value.trim();


    if (city === "") {

        alert(
            "Please enter a city name."
        );

        return;
    }


    await getWeatherByCity(city);

}


// ===============================
// GET WEATHER BY CITY
// ===============================

async function getWeatherByCity(city) {

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

            alert(
                "City not found."
            );

            loading.style.display =
                "none";

            return;
        }


        const location =
            locationData.results[0];


        // Get weather

        const weatherResponse =
            await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
            );


        const weatherData =
            await weatherResponse.json();


        // Display weather

        displayWeather(
            weatherData.current,
            location.name,
            weatherData.daily
        );


        // Display forecast

        displayForecast(
            weatherData.daily
        );


        // Add to history

        addToHistory(
            location.name
        );


        cityInput.value =
            location.name;


        loading.style.display =
            "none";


    }

    catch (error) {

        console.error(error);

        loading.style.display =
            "none";

        alert(
            "Something went wrong. Please try again."
        );

    }

}


// ===============================
// DISPLAY 5-DAY FORECAST
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


        let icon =
            "☀️";

        let text =
            "Clear Sky";


        if (weatherCode === 0) {

            icon = "☀️";
            text = "Clear Sky";

        }

        else if (weatherCode <= 3) {

            icon = "⛅";
            text = "Cloudy";

        }

        else if (weatherCode <= 48) {

            icon = "🌫️";
            text = "Foggy";

        }

        else if (weatherCode <= 67) {

            icon = "🌧️";
            text = "Rainy";

        }

        else if (weatherCode <= 77) {

            icon = "❄️";
            text = "Snowy";

        }

        else if (weatherCode <= 82) {

            icon = "🌦️";
            text = "Rain Showers";

        }

        else {

            icon = "⛈️";
            text = "Thunderstorm";

        }


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "forecast-card";


        card.innerHTML = `

            <h3>
                ${dayName}
            </h3>

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


            isCelsius =
                false;

        }

        else {

            temperature.textContent =
                `${Math.round(currentTemperatureCelsius)}°C`;


            unitBtn.textContent =
                "Switch to °F";


            isCelsius =
                true;

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

                }

                catch (error) {

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
// FAVORITE BUTTON
// ===============================

favoriteBtn.addEventListener(
    "click",
    function () {

        if (
            !currentCity ||
            currentCity === "Your Location"
        ) {

            return;

        }


        const index =
            favorites.indexOf(
                currentCity
            );


        if (index === -1) {

            favorites.push(
                currentCity
            );

        }

        else {

            favorites.splice(
                index,
                1
            );

        }


        saveFavorites();

        renderFavorites();

        updateFavoriteButton();

    }
);


// ===============================
// UPDATE FAVORITE BUTTON
// ===============================

function updateFavoriteButton() {

    if (
        favorites.includes(
            currentCity
        )
    ) {

        favoriteBtn.textContent =
            "★";

        favoriteBtn.title =
            "Remove from favorites";

    }

    else {

        favoriteBtn.textContent =
            "☆";

        favoriteBtn.title =
            "Add to favorites";

    }

}


// ===============================
// SAVE FAVORITES
// ===============================

function saveFavorites() {

    localStorage.setItem(
        "favoriteCities",
        JSON.stringify(favorites)
    );

}


// ===============================
// RENDER FAVORITES
// ===============================

function renderFavorites() {

    favoriteCities.innerHTML =
        "";


    if (
        favorites.length === 0
    ) {

        favoriteCities.innerHTML = `
            <p class="empty-message">
                No favorite cities yet.
            </p>
        `;

        return;
    }


    favorites.forEach(
        function (city) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "city-item";


            item.innerHTML = `

                <button
                    class="city-name-btn"
                    data-city="${city}"
                >
                    ⭐ ${city}
                </button>

                <button
                    class="delete-btn"
                    data-city="${city}"
                >
                    🗑️
                </button>

            `;


            favoriteCities.appendChild(
                item
            );

        }
    );


    // City click

    favoriteCities
        .querySelectorAll(
            ".city-name-btn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const city =
                            this.dataset.city;

                        getWeatherByCity(
                            city
                        );

                        closeSidebar();

                    }
                );

            }
        );


    // Delete click

    favoriteCities
        .querySelectorAll(
            ".delete-btn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const city =
                            this.dataset.city;


                        favorites =
                            favorites.filter(
                                function (item) {

                                    return item !== city;

                                }
                            );


                        saveFavorites();

                        renderFavorites();

                        updateFavoriteButton();

                    }
                );

            }
        );

}


// ===============================
// ADD SEARCH HISTORY
// ===============================

function addToHistory(city) {

    history =
        history.filter(
            function (item) {

                return item.toLowerCase() !==
                    city.toLowerCase();

            }
        );


    history.unshift(city);


    // Keep last 10 cities

    history =
        history.slice(
            0,
            10
        );


    localStorage.setItem(
        "searchHistory",
        JSON.stringify(history)
    );


    renderHistory();

}


// ===============================
// RENDER HISTORY
// ===============================

function renderHistory() {

    searchHistory.innerHTML =
        "";


    if (
        history.length === 0
    ) {

        searchHistory.innerHTML = `
            <p class="empty-message">
                No search history yet.
            </p>
        `;

        return;

    }


    history.forEach(
        function (city) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "city-item";


            item.innerHTML = `

                <button
                    class="city-name-btn"
                    data-city="${city}"
                >
                    🕘 ${city}
                </button>

            `;


            searchHistory.appendChild(
                item
            );

        }
    );


    searchHistory
        .querySelectorAll(
            ".city-name-btn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const city =
                            this.dataset.city;


                        getWeatherByCity(
                            city
                        );


                        closeSidebar();

                    }
                );

            }
        );

}


// ===============================
// INITIAL RENDER
// ===============================

renderFavorites();
renderHistory();


// ===============================
// DEFAULT WEATHER
// ===============================

getWeatherByCity("Dhaka");