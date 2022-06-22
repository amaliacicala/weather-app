// DOM elements
const rootElement = document.documentElement;
const weatherIcon = document.querySelector('.weather-icon');
const weatherLocation = document.querySelector('.weather-location');
const weatherTemperature = document.querySelector('.weather-temperature');
const weatherFeels = document.querySelector('.feels-like');
const maxTemperature = document.querySelector('.max');
const minTemperature = document.querySelector('.min');
const weatherHumidity = document.querySelector('.humidity');
const weatherWind = document.querySelector('.wind');
const suggestionParagraph = document.querySelector('.suggestion');


// location fetching through the Geolocation API
window.navigator.geolocation.getCurrentPosition(onSuccess, onError);

// change theme based on time of day
document.addEventListener('DOMContentLoaded', function() {
	let now = new Date();
	let hours = now.getHours(); 

	if (hours >= 5 && hours <= 6){
        document.body.className = "dawn";
    } else if (hours > 6 && hours <= 7) {
	    document.body.className = "sunrise";
    } else if (hours >= 7 && hours <= 13) {
        document.body.className = "morning";
    } else if (hours > 13 && hours <= 19) {
        document.body.className = "afternoon";
    } else if (hours > 19 && hours <= 20) {
        document.body.className = "sunset";
        weatherLocation.classList.add("white");
        weatherTemperature.classList.add("white");    
    } else if (hours > 20 && hours <= 21) {
        document.body.className = "dusk";
    } else {
        document.body.className = "night";
        weatherLocation.classList.add("white");
        weatherTemperature.classList.add("white");    
    }
});

// in case of error
function onError(error) {
    console.log(error);
    weatherLocation.innerText = 'Devi attivare la geolocalizzazione'
}

// in case of success
function onSuccess(position) {
    console.log(position);

    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const apiKey = '9c175cd693dae927dcef08104bea7203';
    const language = 'it';
    const units = 'metric';
    const endpoint = 'https://api.openweathermap.org/data/2.5/weather';

    // url building
    const apiUrl = `${endpoint}?lat=${latitude}&lon=${longitude}&units=${units}&lang=${language}&appid=${apiKey}`

    // call the external service
    fetch(apiUrl)
        .then(function(response) {
            const data = response.json();
            return data;
        })
        .then(function(data) {
            console.log(data);

            // taking the info we need
            const locationName = data.name;
            const temperature = Math.floor(data.main.temp);
            const iconCode = data.weather[0].icon;
            const description = data.weather[0].description;
            const feelsLike = Math.floor(data.main.feels_like);
            const max = Math.floor(data.main.temp_max);
            const min = Math.floor(data.main.temp_min);
            const humidity = data.main.humidity;
            const wind = data.wind.speed;

            // prepare suggestion
            const suggestion = getSuggestion(iconCode);

            weatherLocation.innerText = locationName;
            weatherTemperature.innerText = `${temperature}°`;
            weatherFeels.innerText = `${feelsLike}°C`;
            maxTemperature.innerText = `${max}°C`;
            minTemperature.innerText = `${min}°C`;
            weatherHumidity.innerText = `${humidity}%`;
            weatherWind.innerText = `${wind}km/h`;
            weatherIcon.alt = description;
            weatherIcon.src = `images/${iconCode}.svg`;
            suggestionParagraph.innerText = suggestion;

            // remove js-loading class
            rootElement.classList.remove('js-loading');
        })
}

// fetch suggestion
function getSuggestion(iconCode) {
    const suggestions = {
      '01d': `Ricordati la crema solare ${String.fromCodePoint(128526)}`,
      '01n': `Buonanotte ${String.fromCodePoint(128164)}`,
      '02d': `Oggi il sole va e viene... ${String.fromCodePoint(128579)}`,
      '02n': `Potresti non vedere la luna... ${String.fromCodePoint(128373)}`,
      '03d': `Luce perfetta per fare foto ${String.fromCodePoint(128526)}${String.fromCodePoint(128248)}`,
      '03n': `Dormi sereno ${String.fromCodePoint(128564)}`,
      '04d': `Il cielo non promette bene ${String.fromCodePoint(128556)}`,
      '04n': `Non si vede nemmeno la luna ${String.fromCodePoint(128566)}`,
      '09d': `Ricordati l'ombrello! ${String.fromCodePoint(127746)}`,
      '09n': `Copriti bene ${String.fromCodePoint(129507)}`,
      '10d': `Ricordati l'ombrello! ${String.fromCodePoint(127746)}`,
      '10n': `Copriti bene ${String.fromCodePoint(129507)}`,
      '11d': `Attento ai fulmini ${String.fromCodePoint(9889)}${String.fromCodePoint(128064)}`,
      '11n': `I lampi accendono la notte... ${String.fromCodePoint(9889)}`,
      '13d': `Esci a fare un pupazzo di neve! ${String.fromCodePoint(9731)}`,
      '13n': `Notte perfetta per stare sotto il piumone ${String.fromCodePoint(129398)}`,
      '50d': `Accendi i fendinebbia! ${String.fromCodePoint(127787)}${String.fromCodePoint(128663)}`,
      '50n': `Guida con prudenza ${String.fromCodePoint(129299)}`,
    }
  
    return suggestions[iconCode];
  }