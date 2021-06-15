// Array holding cities chosen by user
var chosenCity = [];
var id = "";

// Initializes the stored cities from localStorage
function init() {

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
function cityCurrentWeather(currentCity, id) {

}

// Gathers 5-day forecast for chosen city
function cityForecast(currentCity, id) {

}

// Gathers UV Index for current city and changes color based on conditions
function UVIndex() {

}

// Displays current selected city
function displayCurrentCity() {
    cityCurrentWeather();
    cityForecast();
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

// Allows clicking on a searched/saved city and calls the displayCurrentCity function to see weather
$(".chosenCity").on(".click", ".cityButton", displayCurrentCity);