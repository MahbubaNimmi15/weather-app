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
const forecastContainer = document.getElementById("forecastContainer");
const loading = document.getElementById("loading");

const historyContainer =
    document.getElementById("historyContainer");

let currentTemperatureCelsius = null;
let isCelsius = true;


// ===============================
// SEARCH HISTORY DATA
// ===============================

let searchHistory =
    JSON.parse(
        localStorage.getItem("searchHistory")
    ) || [];


// ===============================
// DISPLAY WEATHER
// ===============================

function displayWeather(current, city) {

    cityName.textContent = city;

    currentTemperatureCelsius =
        current.temperature_2m;

    temperature.textContent =
        `${Math.round(currentTemperatureCelsius)}°C`;

    isCelsius = true;

    unitBtn.textContent = "Switch to °F";

    humidity.textContent =
        `${current.relative_humidity_2m}%`;

    wind.textContent =
        `${Math.round(current.wind_speed_10m)} km/h`;


    // Weather condition and icon

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


        // Show loading

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

                loading.style.display =
                    "none";

                alert(
                    "City not found."
                );

                return;
            }


            const location =
                locationData.results[0];


            // Get current + daily weather

            const weatherResponse =
                await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
                );


            const weatherData =
                await weatherResponse.json();


            const current =
                weatherData.current;


            // Display current weather

            displayWeather(
                current,
                location.name
            );


            // Display forecast

            displayForecast(
                weatherData.daily
            );


            // Add city to search history

            addToHistory(
                location.name
            );


            // Hide loading

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
// MY LOCATION WEATHER
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


        // Show loading

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
                            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
                        );


                    const data =
                        await response.json();


                    // Display current weather

                    displayWeather(
                        data.current,
                        "Your Location"
                    );


                    // Display forecast

                    displayForecast(
                        data.daily
                    );


                    // Hide loading

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
// ADD TO SEARCH HISTORY
// ===============================

function addToHistory(city) {

    // Remove duplicate city

    searchHistory =
        searchHistory.filter(
            function (item) {

                return (
                    item.toLowerCase() !==
                    city.toLowerCase()
                );

            }
        );


    // Add newest city first

    searchHistory.unshift(city);


    // Keep only last 5 searches

    searchHistory =
        searchHistory.slice(0, 5);


    // Save history

    localStorage.setItem(
        "searchHistory",
        JSON.stringify(searchHistory)
    );


    displayHistory();
}


// ===============================
// DISPLAY SEARCH HISTORY
// ===============================

function displayHistory() {

    historyContainer.innerHTML = "";


    if (searchHistory.length === 0) {

        historyContainer.innerHTML =
            "<p>No search history yet.</p>";

        return;
    }


    searchHistory.forEach(
        function (city) {

            const button =
                document.createElement("button");


            button.textContent =
                `🕘 ${city}`;


            button.addEventListener(
                "click",
                function () {

                    cityInput.value =
                        city;

                    searchBtn.click();

                }
            );


            historyContainer.appendChild(
                button
            );

        }
    );
}


// ===============================
// LOAD SEARCH HISTORY
// ===============================

displayHistory();

