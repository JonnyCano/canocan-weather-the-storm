let searchedCities = ["atlanta", "chicago", "new+york", "los+angeles"]
let searchInput = document.querySelector('input[name="city"]')
let currentForecastContainer = document.querySelector('#forecastContainer')
let cityNameValueEl = document.querySelector('#city-name-value')
let currentDateValueEl = document.querySelector('#date-value')
let forecastIconEl = document.querySelector('.current-weather-icon')
let currentTemperatureEl = document.querySelector('#current-temperature-value')
let currentWindSpeedEl = document.querySelector('#wind-forecast-value')
let currentHumidityEl = document.querySelector('#current-humidity-value')
let currentUVIndexEl = document.querySelector('#current-uv-index-value')

function myfunction() {
    let working = "CanoCan weather the storm"

    console.log(working)
}

// get the form input
function cityWeatherSearch(event) {
    event.preventDefault()

    let city = searchInput.value.trim()

    let newCityUrl = city.toLowerCase().replace(/ /g, "+")

    if (city) {
        // call the function and send missing search parameter to api that will fetch weather forecast
        getForecast(newCityUrl)
    } else {
        getForecast("chicago")
    }

}

function getForecast(city) {
    const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + ",us&units=imperial&appid=40c1ddce05f09cf635f3679e5aa8ec3d"
    console.log(apiUrl)

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                createSearchedCitiesButtons(city)
                displayForecast(city, data)
            })
        } else {
            alert("Error: City Not Found, Try again.")
            searchInput.value() = ""
        }
    })
}

function displayForecast(city, data) {
    let originalCity = city.replace(/\+/g, " ")

    let textToUpperCase = originalCity[0].toUpperCase()
    let originalCityExceptFirstLetter = originalCity.slice(1)

    let currentWeatherCity = textToUpperCase.concat(originalCityExceptFirstLetter)
    cityNameValueEl.textContent = currentWeatherCity

    // use Date() to figure out the current date in MM/DD/YYYY format:
    const utcDate = Math.abs(data.dt)
    let currentMonth = new Date().getMonth(utcDate)
    const actualMonth = currentMonth += 1
    let currentDay = new Date().getDate(utcDate)
    let currentYear = new Date().getFullYear(utcDate)

    currentDateValueEl.textContent = setTheDate(actualMonth, currentDay, currentYear)
    
    getForecastIcon(data)
    setTheCurrentTemperature(data)
    setTheCurrentWindSpeed(data)
    setTheCurrentHumidity(data)
    setTheCurrentUVIndex(data)

}

function setTheDate(month, day, year) {
    let dateString = " (" + month + "/" + day + "/" + year + ") "

    return dateString
}

function getForecastIcon(data) {

    // set the alt attribute for enhanced accessibility
    const forecastDescription = data.weather[0].description
    forecastIconEl.setAttribute('alt', forecastDescription)

    // set the src attribute to the url in the api using the directions in the documentation
    const forecastIconId = data.weather[0].icon
    let forecastIconUrl = "http://openweathermap.org/img/wn/" + forecastIconId + "@2x.png"
    forecastIconEl.setAttribute('src', forecastIconUrl)
}

function setTheCurrentTemperature(data) {
    const forecastTemperatureValue = data.main.temp
    currentTemperatureEl.textContent = forecastTemperatureValue
}

function setTheCurrentWindSpeed(data) {
    const currentWindSpeedValue = data.wind.speed + " MPH"

    currentWindSpeedEl.textContent = currentWindSpeedValue
}

function setTheCurrentHumidity(data) {
    const currentHumidityValue = data.main.humidity

    currentHumidityEl.textContent = currentHumidityValue + " %"
}

function setTheCurrentUVIndex(data) {
    const lon = data.coord.lon.toFixed(2)
    const lat = data.coord.lat.toFixed(2)

    const apiUvIndexUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,daily&appid=40c1ddce05f09cf635f3679e5aa8ec3d"

    fetch(apiUvIndexUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                setUvIndexBackground(data.current.uvi)
                const currentUvIndexValue = data.current.uvi
                currentUVIndexEl.textContent = currentUvIndexValue
            })
        } else {
            alert("Error: current UV index is not available at this time")
            currentUvIndexValue.textContent = ""
        }
    })
}

function setUvIndexBackground(uvi) {
    if (uvi <= 2) {
        currentUVIndexEl.style.background = "lightgreen"
    } else if (uvi > 2 && uvi <= 5) {
        currentUVIndexEl.style.background = "yellow"
    } else if (uvi > 5 && uvi <= 7) {
        currentUVIndexEl.style.background = "orange"
    } else if (uvi > 7) {
        currentUVIndexEl.style.color = "white"
        currentUVIndexEl.style.background = "red"
    }
}

function createSearchedCitiesButtons(city) {
    if (localStorage.getItem('searchedCitiesForecasts') == null) {
        searchedCities.push(city)
        localStorage.setItem('searchedCitiesForecasts', JSON.stringify(searchedCities))
    }

    searchedCities = JSON.parse(localStorage.getItem('searchedCitiesForecasts'))

    console.log(searchedCities)
}

myfunction()