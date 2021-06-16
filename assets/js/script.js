// Array holding cities chosen by user
var chosenCity = [];

// apiKey pulled from OpenWeather.org after creating account
var apiKey = "f7ca17a242e6b7c41151b1230dbe1472";

var today = moment().format('L');

// Initializes the stored cities from localStorage
function init() {
    var savedCities = JSON.parse(localStorage.getItem("cities"));

    if(savedCities !== null) {
        chosenCity = savedCities;
    }

    cityList();

    if(chosenCity) {
        var loadCity = chosenCity[chosenCity.length - 1];
        cityCurrentWeather(loadCity, apiKey);
        cityForecast(loadCity, apiKey);
    }
}

// Allows searching of cities and adding them into the array
function cityList() {
    $(".chosenCity").empty();
    chosenCity.forEach(function(city) {
        $(".chosenCity").prepend($(`<button class='list-group-item list-group-item-action cityButton' data-city='${city}'>${city}</button>`));
    })
};

// Stores city list in localStorage
function storeCity() {
    localStorage.setItem("cities", JSON.stringify(chosenCity));
};

// Gathers current weather for city selected from the stored cities
function cityCurrentWeather(loadCity, apiKey) {
    var openWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${loadCity}&appid=${apiKey}`;
    var cityLon;
    var cityLat;

    $.ajax({
        url: openWeatherURL,
        method: "GET"
    }).then(function(data) {
        $(".cityCurrent").append(
            `<div class="row">
                <h3>${data.name} ${today}<img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png"/></h3>
            </div>`
        )
        console.log(data);
        $(".cityCurrent").append(`<p>Temperature: ${data.main.temp} &degF</p>`)
        $(".cityCurrent").append(`<p>Humidity: ${data.main.humidity} %</p>`)
        $(".cityCurrent").append(`<p>Wind: ${data.wind.speed} mph</p>`)

        cityLon = data.coord.lon;
        cityLat = data.coord.lat;
        UVIndex(apiKey, cityLat, cityLon);
    })
}

// Gathers 5-day forecast for chosen city
function cityForecast(loadCity, apiKey) {
    var forecastWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?q=${loadCity}&appid=${apiKey}`;

    $.ajax({
        url: forecastWeatherURL,
        method: "GET"
    }).then(function(data) {
        
    })
}

// Gathers UV Index for current city and changes color based on conditions (colors were found via wikipedia)
function UVIndex(apiKey, cityLat, cityLon) {
    var indexURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}`;

    $.ajax({
        url: indexURL,
        method: "GET"
    }).then(function(data) {
        console.log(data);
        var indexNum = data.value;
        $(".cityCurrent").append(`<p>UV Index: <span id="indexColor" class="p-2 rounded">${indexNum}</span></p>`)
        
        if(indexNum >= 0 && indexNum <=2) {
            $("#indexColor").css("background-color", "#3EA72D").css("color", "white");
        } else if(indexNum >= 3 && indexNum <=5) {
            $("#indexColor").css("background-color", "#FFF300");
        } else if (indexNum >= 6 && indexNum <= 7) {
            $("#indexColor").css("background-color", "#F18B00");
        } else if (indexNum >= 8 && indexNum <= 10) {
            $("#indexColor").css("background-color", "#E53210").css("color", "white");
        } else {
            $("#indexColor").css("background-color", "#B567A4").css("color", "white");
        }
    })
}

// Displays current selected city
function displayCurrentCity() {
    console.log("I clicked the button");

    var loadCity = $(this).attr("data-city");

    $(".cityCurrent").empty();
    cityCurrentWeather(loadCity, apiKey);
    
    $(".cityForecast").empty();
    cityForecast(loadCity, apiKey);
}

init();

// Allows saving of searched city and adds it to the chosenCity array for viewing later
$("form").on("submit", function(event) {
    event.preventDefault();
    var thisCity = $("#cityInput").val().trim();
    console.log(thisCity);
    chosenCity.push(thisCity);
    cityList();
    storeCity();
    $("#cityInput").val("");
})

// Allows clicking on a searched/saved city and calls the displayCurrentCity function to see weather
$(".chosenCity").on("click", ".cityButton", displayCurrentCity);