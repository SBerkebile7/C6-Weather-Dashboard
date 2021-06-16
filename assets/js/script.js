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
    var openWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${loadCity}&units=imperial&appid=${apiKey}`;
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
        $(".cityCurrent").append(`<p>Wind: ${data.wind.speed} mph</p>`)
        $(".cityCurrent").append(`<p>Humidity: ${data.main.humidity} %</p>`)

        cityLon = data.coord.lon;
        cityLat = data.coord.lat;
        UVIndex(apiKey, cityLat, cityLon);
        cityForecast(cityLat, cityLon, loadCity);
    })
}

// Gathers 5-day forecast for chosen city
function cityForecast(cityLat, cityLon, loadCity) {
    // This URL doesn't work, but will continue troubleshooting
    //var forecastWeatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;
    var forecastWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?q=${loadCity}&units=imperial&appid=${apiKey}`;

    console.log("lat: " + cityLat + " & lon: " + cityLon);
    $.ajax({
        url: forecastWeatherURL,
        method: "GET"
    }).then(function(data) {
        for(i = 0; i < data.list.length; i++) {
            console.log("I am loading the days " + [i]);
            var forecastDate = data.list[i];
            var thisDay = moment.unix(data.list[i].dt).format("MM/DD/YYYY");
            console.log("below is the forecastDate");
            console.log(forecastDate);
            console.log("Above is the thisDay date");
            console.log(thisDay);
            
            if(data.list[i].dt_txt.search("15:00:00") != -1) {
                $(".weatherForecast").append(
                    `<div class="card m-2" style="width: 12rem">
                        <div class="card-body">
                            <h4 class="card-title">${thisDay}</h4>
                            <div class="card-text">
                                <p><img src="https://openweathermap.org/img/w/${forecastDate.weather[0].icon}.png"/></p>
                                <p>Temp: ${forecastDate.main.temp} &degF</p>
                                <p>Wind: ${forecastDate.wind.speed} mph</p>
                                <p>Humidity: ${forecastDate.main.humidity} %</p>
                            </div>
                        </div>
                    </div>`
                );
            }
        }
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
    
    $(".weatherForecast").empty();
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