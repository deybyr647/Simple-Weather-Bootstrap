/*
    Form Components
    Here, we are grabbing the form and input elements from the DOM, using the querySelector method.
    This method allows us to grab elements by their id, class, or tag name.
    We are grabbing them and storing them in variables for later use and easy access.
*/
const form = document.querySelector("#zipForm");
const zipInput = document.querySelector("#zipInput");

/*
    Data Display Components
    Here, we are grabbing the elements from the DOM that will display the weather data.
    Just like we did with the form and input elements, we're grabbing them and storing them for easy access.
    Later on, we will use these variables to display the data we get from OpenWeatherMap
*/

const cityName = document.querySelector("#cityName");
const conditionImage = document.querySelector("#conditionImage");
const conditionText = document.querySelector("#conditionText");
const temperature = document.querySelector("#temperature");
const tempMax = document.querySelector("#tempMax");
const tempMin = document.querySelector("#tempMin");
const perspectiveTemp = document.querySelector("#perspectiveTemp");
const windSpeed = document.querySelector("#windSpeed");
const pressureVal = document.querySelector("#pressure");
const humidityPercentage = document.querySelector("#humidityPercentage");
const timeStamp = document.querySelector("#timestamp");

/*
    The getTime function is a helper function that will return the current time in a string format.
    This function will be used to display the time that the data was fetched.
    This function and all the others are using the ES6 arrow function syntax.
*/

function getTime() {
    // Get the current date and time from the Date object
    const date = new Date;

    // Get the current hour, minute, and second
    let hours = date.getHours();
    let minutes = date.getMinutes();

    // Here, we are checking if it is AM or PM
    let timeOfDay;

    if (hours >= 12) {
        timeOfDay = "pm"
    } else {
        timeOfDay = "am"
    }

    // Here, we are converting the 24-hour time to 12 hour time
    // If the hour is 0, then it is 12am
    hours = hours % 12;
    if (hours === 0) {
        hours = 12;
    }

    // If the minutes is less than 10, then we add a 0 in front of it
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    // Return the time in a string format
    const timeString = hours + ':' + minutes + ' ' + timeOfDay;
    return timeString;
}

/*
    The getWeatherData function is an async function that will fetch the weather data from OpenWeatherMap.
    The endpoint is the URL that we are requesting the data from.
    We also have a URL Search Parameters object that will hold the parameters that we will pass to the endpoint.
*/
async function getWeatherData(zip = 10001) {
    // URL we are fetching data from. This URL pertains to the current weather data API endpoint from OpenWeatherMap
    const endpoint = "https://api.openweathermap.org/data/2.5/weather?";

    // Here is our URL Search Parameters object.
    // We are passing in the zip code and our API key to the endpoint.

    // The appid parameter is the API key that we got from OpenWeatherMap. This key is unique to each user.
    // The API Key is used to identify the user and to prevent abuse of the API.

    // The units parameter is used to specify the units of the data that we are requesting.
    // The lang parameter is used to specify the language of the data that we are requesting.
    const dataParams = new URLSearchParams({
        zip: `${zip},us`,
        appid: "adb117b6500a18ac7ad60e3d23b0ac24",
        units: "imperial",
        lang: "en",
    });

    // Here we're calling the getTime function to get the current time, as to add a timestamp to our data.
    const timestamp = getTime();

    // Here we are fetching the data from the endpoint, and passing in the dataParams object as a parameter.
    // We do so by concatenating the endpoint and the dataParams object inside the fetch method.
    // The await directive is telling us that we are awaiting the response from the endpoint.
    const request = await fetch(endpoint + dataParams);
    // Here, we are awaiting the response to be parsed into JSON format, for easy use.
    const response = await request.json();

    // Here, we're combining the response data and the timestamp into a single data object, for easy access.
    // We're also printing, or logging it to the console
    const data = {...response, timestamp}; // Spread Operator
    console.log(data);

    // Here, we are returning the data object we made
    return data;
}

/*
    The getWeatherData function is a function that takes care of getting and displaying the weather data.
    It makes use of the getWeatherData function that we made earlier.
*/
async function displayWeatherData(zip) {
    // Here, we are awaiting the data from the getWeatherData function.
    // We are passing in the zip code that we got from the input element.
    const weatherData = await getWeatherData(zip);

    // Here, we are destructuring the data object that we got from the getWeatherData function.
    // We do this so that we write less code and have easier access to the data.
    // Notice how we rename the weather property to conditions, so that it is easier to understand
    // We can think of each property here as a different variable pertaining to a nested object with data.
    // in other words, we can also think of each as a particular data category.
    const { name, main, timestamp, weather: conditions, wind } = weatherData;

    // Once again, we're destructuring the "main" object, so that we can access the data more easily.
    // As you can see, the main object itself has a lot of nested data
    const { feels_like, humidity, pressure, temp, temp_max, temp_min } = main;

    // Remember how we created all those variables to hold the DOM elements that we will be displaying the data in?
    // Well, here we are using those variables to display the data.
    // We are using the innerText property to set the innerText value of the elements to the data we want to display.
    // We're also adding more text to the data, so that it is more readable and easier to understand.
    cityName.innerText = name;
    temperature.innerText = "Temperature: " + temp + "°F";
    tempMax.innerText = "High: " + temp_max + "°F";
    tempMin.innerText = "Low: " + temp_min + "°F";
    perspectiveTemp.innerText = "Feels Like " + feels_like + "°F";
    windSpeed.innerText = "Wind Speed: " + wind.speed + " mph";
    pressureVal.innerText = "Pressure: " + pressure + " hPa";
    humidityPercentage.innerText = "Humidity: " + humidity + "%";
    timeStamp.innerText = "Data fetched at " + timestamp;

    // Once again, we're destructuring the conditions object, so that we can access the data more easily.
    // The object is within an array called conditions, so we have to access the first element of the array.
    // The object includes a description of the weather conditions, along with an icon code
    const { description, icon } = conditions[0];

    // Here, we are setting the innerText of the weatherDescription element to the description of the weather conditions.
    // We're also setting the src attribute of the weatherIcon element to the URL of the icon that OpenWeatherMap provides.
    // We do this by using another OpenWeatherMap endpoint, along with the icon code that we got before
    conditionText.innerText = description;
    conditionImage.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

// Here, we are telling the browser to display weather data for a preset zip code when the page loads.
window.onload = async function () {
    await displayWeatherData();
}

// Here, we are telling the browser to display weather data for the zip code that the user inputs when the form is submitted.
form.onsubmit = async function(event) {
    // Here, we are preventing the default behavior of the form, which is to refresh the page.
    // This is so that when we get our weather data, the browser doesn't automatically reload the page.
    event.preventDefault();

    // We use the zip code here from the form and pass it to our displayWeatherData function.
    await displayWeatherData(zipInput.value);

    // Here, we are resetting the value of the input element to an empty string, after getting and displaying fresh data
    zipInput.value = "";
}