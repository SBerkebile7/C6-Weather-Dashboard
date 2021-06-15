// Array holding cities chosen by user
var chosenCity = [];

// id pulled from OpenWeather.org after creating account
var id = "f7ca17a242e6b7c41151b1230dbe1472";

// Initializes the stored cities from localStorage
function init() {
    var savedCities = JSON.parse(localStorage.getItem("cities"));

    if(savedCities !== null) {
        chosenCity = savedCities;
    }

    cityList();

    if(chosenCity) {
        var loadCity = chosenCity[chosenCity.length - 1];
        cityCurrentWeather(loadCity, id);
        cityForecast(loadCity, id);
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
function cityCurrentWeather(loadCity, id) {
    var openWeatherURL = `api.openweathermap.org/data/2.5/weather?q=${loadCity}&appid=${id}`;
    var cityLon;
    var cityLat;

    $.get(openWeatherURL);
}

// Gathers 5-day forecast for chosen city
function cityForecast(loadCity, id) {

}

// Gathers UV Index for current city and changes color based on conditions
function UVIndex() {

}

// Displays current selected city
function displayCurrentCity() {
    console.log("I clicked the button");

    var loadCity = $(this).attr("data-city");

    $(".cityCurrent").empty();
    cityCurrentWeather(loadCity, id);
    
    $(".cityForecast").empty();
    cityForecast(loadCity, id);
}

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

init();

// Allows clicking on a searched/saved city and calls the displayCurrentCity function to see weather
$(".chosenCity").on("click", ".cityButton", displayCurrentCity);