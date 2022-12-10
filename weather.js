// Form Components
const form = document.querySelector("#zipForm");
const zipInput = document.querySelector("#zipInput");
const submitButton = document.querySelector("#submit");

// Data Display Components
const cityName = document.querySelector("#cityName");
const conditionImage = document.querySelector("#conditionImage");
const conditionText = document.querySelector("#conditionText");
const temperature = document.querySelector("#temperature");
const perspectiveTemp = document.querySelector("#perspectiveTemp");
const windSpeed = document.querySelector("#windSpeed");
const pressureVal = document.querySelector("#pressure");
const humidityPercentage = document.querySelector("#humidityPercentage");
const timeStamp = document.querySelector("#timestamp");

const getTime = () => {
    const date = new Date;

    let hours = date.getHours();
    let minutes = date.getMinutes();
    let timeOfDay;

    if (hours >= 12) {
        timeOfDay = "pm"
    } else {
        timeOfDay = "am"
    }

    hours = hours % 12;
    if (hours === 0) {
        hours = 12;
    }

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    const timeString = hours + ':' + minutes + ' ' + timeOfDay;
    return timeString;
}

const getWeatherData = async (zip = 10001) => {
    const endpoint = "https://api.openweathermap.org/data/2.5/weather?";

    const dataParams = new URLSearchParams({
        zip: `${zip},us`,
        appid: "adb117b6500a18ac7ad60e3d23b0ac24",
        units: "imperial",
        lang: "en",
    });

    const timestamp = getTime();

    const request = await fetch(endpoint + dataParams);
    const response = await request.json();

    console.log({...response, timestamp});

    return {...response, timestamp};
}

const displayWeatherData = async (zip) => {
    const weatherData = await getWeatherData(zip);

    // Data Categories
    const { name, main, timestamp, weather: conditions, wind } = weatherData;

    // Main Weather Data
    const { feels_like, humidity, pressure, temp, temp_max, temp_min } = main;
    
    cityName.innerText = name;
    temperature.innerText = "Temperature: " + temp + "°F";
    perspectiveTemp.innerText = "Feels Like " + feels_like + "°F";
    windSpeed.innerText = "Wind Speed: " + wind.speed + " mph";
    pressureVal.innerText = "Pressure: " + pressure + " hPa";
    humidityPercentage.innerText = "Humidity: " + humidity + "%";
    timeStamp.innerText = "Data fetched at " + timestamp;

    // Conditions Info
    const { description, icon } = conditions[0];
    conditionText.innerText = description;
    conditionImage.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

window.onload = () => {
    displayWeatherData();
}

form.onsubmit = (event) => {
    event.preventDefault();
    displayWeatherData(zipInput.value);
    zipInput.value = "";
}