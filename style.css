
/* =========================
   RESET
========================= */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}


/* =========================
   BODY
========================= */

body {
    font-family: Arial, sans-serif;

    min-height: 100vh;

    background:
        linear-gradient(
            135deg,
            #74ebd5,
            #9face6
        );

    color: #222;

    transition:
        background 0.3s ease,
        color 0.3s ease;
}


/* =========================
   TOP NAVBAR
========================= */

.navbar {
    height: 70px;

    width: 100%;

    display: flex;

    align-items: center;

    padding: 0 25px;

    background: rgba(
        255,
        255,
        255,
        0.92
    );

    box-shadow:
        0 3px 15px
        rgba(0, 0, 0, 0.12);

    position: sticky;

    top: 0;

    z-index: 1000;

    transition:
        background 0.3s ease;
}


/* Menu Button */

.menu-btn {
    border: none;

    background: transparent;

    font-size: 28px;

    cursor: pointer;

    width: 45px;

    height: 45px;

    border-radius: 10px;

    transition: 0.2s;
}


.menu-btn:hover {
    background: #eef2ff;
}


/* Logo */

.logo {
    font-size: 22px;

    font-weight: bold;

    margin-left: 10px;
}


/* Theme Button */

.theme-btn {
    margin-left: auto;

    width: 44px;

    height: 44px;

    border: none;

    border-radius: 50%;

    cursor: pointer;

    font-size: 21px;

    background: #eef2ff;

    transition: 0.2s;
}


.theme-btn:hover {
    transform: scale(1.05);
}


/* =========================
   SIDEBAR
========================= */

.sidebar {
    position: fixed;

    top: 0;

    left: -300px;

    width: 290px;

    height: 100vh;

    padding: 25px 18px;

    background:
        rgba(
            255,
            255,
            255,
            0.98
        );

    box-shadow:
        5px 0 25px
        rgba(0, 0, 0, 0.2);

    z-index: 2000;

    overflow-y: auto;

    transition:
        left 0.3s ease;
}


/* Sidebar Open */

.sidebar.active {
    left: 0;
}


/* Sidebar Header */

.sidebar-header {
    display: flex;

    align-items: center;

    justify-content: space-between;

    margin-bottom: 35px;
}


.sidebar-header h2 {
    color: #333;

    font-size: 21px;
}


/* Close Button */

.close-btn {
    border: none;

    background: transparent;

    font-size: 21px;

    cursor: pointer;

    padding: 7px;

    border-radius: 7px;
}


.close-btn:hover {
    background: #f0f0f0;
}


/* =========================
   SIDEBAR SECTIONS
========================= */

.sidebar-section {
    margin-bottom: 30px;
}


.sidebar-section h3 {
    font-size: 17px;

    margin-bottom: 13px;

    color: #444;
}


/* =========================
   SIDEBAR ITEMS
========================= */

.sidebar-item {
    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 8px;

    background: #f3f5f7;

    padding: 10px 12px;

    margin-bottom: 8px;

    border-radius: 9px;

    transition: 0.2s;
}


.sidebar-item:hover {
    transform: translateX(2px);
}


/* City Button */

.city-button {
    flex: 1;

    border: none;

    background: transparent;

    text-align: left;

    cursor: pointer;

    font-size: 15px;

    color: #333;
}


.city-button:hover {
    color: #4b63d3;
}


/* Delete */

.delete-btn {
    border: none;

    background: transparent;

    cursor: pointer;

    font-size: 16px;

    padding: 3px;
}


.delete-btn:hover {
    transform: scale(1.15);
}


/* Empty Message */

.empty-message {
    color: #888;

    font-size: 14px;

    padding: 5px 2px;
}


/* =========================
   OVERLAY
========================= */

.overlay {
    position: fixed;

    inset: 0;

    background:
        rgba(0, 0, 0, 0.35);

    z-index: 1500;

    opacity: 0;

    visibility: hidden;

    transition:
        opacity 0.3s ease;
}


.overlay.active {
    opacity: 1;

    visibility: visible;
}


/* =========================
   MAIN CONTENT
========================= */

.main-content {
    min-height:
        calc(100vh - 70px);

    display: flex;

    justify-content: center;

    padding: 45px 20px;
}


.weather-container {
    width: 90%;

    max-width: 850px;

    text-align: center;
}


/* Heading */

.weather-container > h1 {
    color: white;

    margin-bottom: 20px;

    font-size: 36px;
}


/* =========================
   SEARCH
========================= */

.search-box {
    display: flex;

    gap: 10px;

    margin-bottom: 20px;
}


.search-box input {
    flex: 1;

    padding: 14px;

    border: none;

    border-radius: 10px;

    font-size: 16px;

    outline: none;

    background: white;
}


.search-box button {
    padding: 14px 18px;

    border: none;

    border-radius: 10px;

    cursor: pointer;

    font-size: 15px;

    font-weight: bold;

    transition: 0.2s;
}


.search-box button:hover {
    transform:
        translateY(-1px);
}


/* =========================
   LOADING
========================= */

#loading {
    display: none;

    color: white;

    font-weight: bold;

    margin-bottom: 15px;
}


/* =========================
   WEATHER CARD
========================= */

.weather-card {
    background:
        rgba(
            255,
            255,
            255,
            0.92
        );

    padding: 30px;

    border-radius: 20px;

    box-shadow:
        0 10px 30px
        rgba(0, 0, 0, 0.2);

    transition:
        background 0.3s ease,
        color 0.3s ease;
}


/* City Title */

.city-title {
    display: flex;

    justify-content: center;

    align-items: center;

    gap: 12px;
}


.weather-card h2 {
    font-size: 28px;

    margin-bottom: 10px;
}


/* Favorite */

#favoriteBtn {
    border: none;

    background: transparent;

    font-size: 30px;

    cursor: pointer;
}


/* Weather Icon */

.weather-icon {
    font-size: 70px;

    margin: 10px 0;
}


/* Temperature */

.weather-card h3 {
    font-size: 45px;

    margin: 10px 0;
}


/* Unit Button */

#unitBtn {
    padding: 9px 15px;

    border: none;

    border-radius: 8px;

    cursor: pointer;

    font-weight: bold;
}


/* Condition */

.weather-card > p {
    font-size: 20px;

    margin:
        18px 0 25px;
}


/* =========================
   WEATHER INFO
========================= */

.weather-info {
    display: flex;

    justify-content:
        space-around;

    flex-wrap: wrap;

    gap: 15px;

    border-top:
        1px solid #ddd;

    padding-top: 20px;
}


.weather-info div {
    min-width: 120px;

    text-align: center;
}


.weather-info span {
    font-size: 25px;
}


.weather-info p {
    margin: 5px 0;

    color: #666;
}


.weather-info strong {
    font-size: 17px;
}


/* =========================
   FORECAST
========================= */

.forecast-section {
    margin-top: 25px;
}


.forecast-section h2 {
    color: white;

    margin-bottom: 15px;
}


.forecast-container {
    display: grid;

    grid-template-columns:
        repeat(5, 1fr);

    gap: 12px;
}


.forecast-card {
    background:
        rgba(
            255,
            255,
            255,
            0.92
        );

    padding: 18px 10px;

    border-radius: 15px;

    box-shadow:
        0 5px 15px
        rgba(0, 0, 0, 0.12);

    transition:
        background 0.3s ease,
        color 0.3s ease;
}


.forecast-card h3 {
    margin-bottom: 10px;
}


.forecast-icon {
    font-size: 35px;

    margin: 8px 0;
}


.forecast-temperature {
    font-weight: bold;

    margin: 8px 0;
}


.forecast-condition {
    font-size: 13px;

    color: #666;
}


/* =========================
   DARK MODE
========================= */

body.dark-mode {

    background:
        linear-gradient(
            135deg,
            #111827,
            #1f2937
        );

    color: #f9fafb;
}


/* Navbar */

body.dark-mode .navbar {

    background: #111827;

    color: #f9fafb;
}


/* Menu */

body.dark-mode .menu-btn {

    color: white;
}


body.dark-mode .menu-btn:hover {

    background: #374151;
}


/* Theme */

body.dark-mode .theme-btn {

    background: #374151;

    color: white;
}


/* Sidebar */

body.dark-mode .sidebar {

    background: #111827;

    color: white;
}


body.dark-mode .sidebar-header h2 {

    color: white;
}


body.dark-mode .sidebar-section h3 {

    color: #f1f5f9;
}


body.dark-mode .sidebar-item {

    background: #1f2937;
}


body.dark-mode .city-button {

    color: #e5e7eb;
}


body.dark-mode .city-button:hover {

    color: #93c5fd;
}


body.dark-mode .close-btn {

    color: white;
}


body.dark-mode .close-btn:hover {

    background: #374151;
}


/* Search Input */

body.dark-mode .search-box input {

    background: #1f2937;

    color: white;
}


body.dark-mode
.search-box input::placeholder {

    color: #9ca3af;
}


/* Search Buttons */

body.dark-mode .search-box button {

    background: #374151;

    color: white;
}


/* Weather Card */

body.dark-mode .weather-card {

    background: #1f2937;

    color: white;
}


/* Unit */

body.dark-mode #unitBtn {

    background: #374151;

    color: white;
}


/* Weather Info */

body.dark-mode .weather-info {

    border-top-color: #374151;
}


body.dark-mode .weather-info p {

    color: #cbd5e1;
}


/* Forecast */

body.dark-mode .forecast-card {

    background: #1f2937;

    color: white;
}


body.dark-mode
.forecast-condition {

    color: #cbd5e1;
}


/* =========================
   MOBILE
========================= */

@media (max-width: 800px) {

    .forecast-container {

        grid-template-columns:
            repeat(2, 1fr);
    }

}


@media (max-width: 600px) {

    .navbar {

        padding: 0 15px;
    }


    .logo {

        font-size: 18px;
    }


    .main-content {

        padding:
            30px 12px;
    }


    .weather-container {

        width: 100%;
    }


    .search-box {

        flex-direction: column;
    }


    .forecast-container {

        grid-template-columns:
            1fr;
    }


    .weather-info {

        display: grid;

        grid-template-columns:
            repeat(2, 1fr);
    }


    .sidebar {

        width: 280px;

        left: -290px;
    }

}

