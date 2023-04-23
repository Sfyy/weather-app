async function getWeatherData(location) {
  const url = `https://api.weatherapi.com/v1/current.json?key=8cb75ca06fee451fa7a145654231804&q=${location}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function parseWeatherData(data) {
  const { location, current } = data;
  if (!location) {
    throw new Error("Invalid location");
  }
  const { name, region, country, localtime } = location;
  const { temp_c, condition, wind_kph, humidity } = current;
  const { text, icon } = condition;
  let weatherIcon = null;
  if (text.includes("sunny")) {
    weatherIcon = "fa-sun";
  } else if (text.includes("Clear")) {
    weatherIcon = "fa-sun";
  } else if (text.includes("cloudy")) {
    weatherIcon = "fa-cloud";
  } else if (text.includes("rain")) {
    weatherIcon = "fa-cloud-rain";
  } else if (text.includes("snow")) {
    weatherIcon = "fa-snowflake";
  } else if (text.includes("Mist")) {
    weatherIcon = "fa-smog";
  } else if (text.includes("Overcast")) {
    weatherIcon = "fa-cloud-showers-heavy";
  }
  return {
    location: `${name}, ${country}`,
    time: localtime,
    temperature: `${temp_c}°C`,
    description: text,
    icon: weatherIcon,
    wind: `${wind_kph} km/h`,
    humidity: `${humidity}%`,
  };
}

const form = document.querySelector("form");
const locationInput = document.querySelector("#location-input");
const submitButton = document.querySelector("#submit-button");
const weatherInfoElement = document.querySelector(".weather-info");
const weatherIconElement = document.querySelector(".weather-icon");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const location = locationInput.value;
  const spinnerElement = weatherInfoElement.querySelector(".spinner");
  spinnerElement.style.display = "block";
  try {
    const weatherData = await getWeatherData(location);
    const weatherInfo = parseWeatherData(weatherData);
    spinnerElement.style.display = "none";

    // Update weather information
    weatherInfoElement.querySelector(".location").textContent =
      weatherInfo.location;
    weatherInfoElement.querySelector(".time").textContent = weatherInfo.time;
    weatherInfoElement.querySelector(".temperature").textContent =
      weatherInfo.temperature;
    weatherInfoElement.querySelector(".description").textContent =
      weatherInfo.description;
    const weatherIconElement =
      weatherInfoElement.querySelector(".weather-icon");
    weatherIconElement.innerHTML = ""; // Clear the content of the weather-icon element
    const weatherIcon = document.createElement("i");
    weatherIcon.className = "weather-icon fas fa-2x " + weatherInfo.icon;
    weatherIconElement.appendChild(weatherIcon);
    weatherInfoElement.querySelector(".wind").textContent = weatherInfo.wind;
    weatherInfoElement.querySelector(".humidity").textContent =
      weatherInfo.humidity;

    weatherInfoElement.style.display = "block";
  } catch (error) {
    spinnerElement.style.display = "none";
    if (location === "") {
      weatherInfoElement.querySelector(".location").textContent = "";
    } else if (error.message === "Invalid location") {
      weatherInfoElement.querySelector(
        ".location"
      ).textContent = `${location} not found!`;
    } else {
      weatherInfoElement.querySelector(".location").textContent =
        "An error occurred. Please try again later.";
    }
    weatherInfoElement.querySelector(".time").textContent = "";
    weatherInfoElement.querySelector(".temperature").textContent = "";
    weatherInfoElement.querySelector(".description").textContent = "";
    const weatherIconElement =
      weatherInfoElement.querySelector(".weather-icon");
    weatherIconElement.innerHTML = ""; // Clear the content of the weather-icon element
    weatherInfoElement.querySelector(".wind").textContent = "";
    weatherInfoElement.querySelector(".humidity").textContent = "";
  }
});
