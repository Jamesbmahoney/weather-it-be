var apiKey = "b5521588823531ae4d680a21d0efd6ca";

var textInputEl = $("#text-input");
var clearEl = $("#clear-btn");
var weatherContentEl = $("#weather-content");
var searchListEl = $("#search-list");

var cityList = [];

initList();
clearButton();

$(document).on("submit", function(e) {
    e.preventDefault();

    var cityName = textInputEl.val();
    
    getWeather(cityName);    
    searchHistory(cityName);

});

$("#get-btn").on("click", function (event) {
    event.preventDefault();    

    var cityName = textInputEl.val();

    getWeather(cityName);    
    searchHistory(cityName);
});

$("#clear-btn").on("click", function (event) {
    cityList = [];
    listArray();

    $(this).addClass("hide");
});

function getWeather(cityName) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey;
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    // console.log(data.main);

                    var dailyTemp = data.main.temp;
                    var dailyHumid = data.main.humidity;
                    var dailyWS = data.wind.speed;

                    // console.log(data);

                    var cityName = textInputEl.val();

                    
                    document.getElementById("city").innerHTML = cityName;
                    document.getElementById("dailytemp").innerHTML = "Temp: " + Number(dailyTemp).toFixed(1) + "°";
                    document.getElementById("dailyhumid").innerHTML = "Humidity: " + Number(dailyHumid).toFixed(1) + "%";
                    document.getElementById("dailyws").innerHTML = "Wind Speed: " + Number(dailyWS).toFixed(1);

                    var lat = data.coord.lat;
                    var lon = data.coord.lon;
                    getDailyDay(lat, lon);
                })
            }
        });
}

function getDailyDay(lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    // console.log(data);

                    displayWeatherFiveDay(data.daily);
                })
            }
        });
}

function displayWeatherFiveDay(weather) {
    for (var i = 0; i < weather.length; i++) {
        var fiveDayTemp = weather[i].temp.day;
        var fiveDayHumid = weather[i].humidity;

        // console.log(fiveDayTemp, fiveDayHumid);

        document.getElementById("img" + (i + 1)).src = "http://openweathermap.org/img/wn/" +
            weather[i].weather[0].icon
            + ".png";
        document.getElementById("daytemp" + (i + 1)).innerHTML = "Temp: " + Number(fiveDayTemp).toFixed(1) + "°";
        document.getElementById("dayhumid" + (i + 1)).innerHTML = "Humidity: " + Number(fiveDayHumid).toFixed(1);

    }
}

var d = new Date();
var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",];

function CheckDay(day) {
    if (day + d.getDay() > 6) {
        return day + d.getDay() - 7;
    }
    else {
        return day + d.getDay();
    }
}

for (i = 0; i < 5; i++) {
    document.getElementById("day" + (i + 1)).innerHTML = weekday[CheckDay(i)];
}

function searchHistory(cityName) {

    if (cityName) {
        if (cityList.indexOf(cityName) === -1) {
            cityList.push(cityName);

            listArray();
            clearEl.removeClass("hide");
            weatherContentEl.removeClass("hide");
        } else {
            var removeIndex = cityList.indexOf(cityName);
            cityList.splice(removeIndex, 1);

            cityList.push(cityName);

            listArray();
            clearEl.removeClass("hide");
            weatherContentEl.removeClass("hide");
        }
    }
}


function listArray() {
    searchListEl.empty();
    cityList.forEach(function(city){
        var searchItem = $('<li class="list-group-item city-btn">');
        searchItem.attr("data-value", city);
        searchItem.text(city);
        searchListEl.prepend(searchItem);
    });

    localStorage.setItem("cities", JSON.stringify(cityList));
}

function initList() {
    if (localStorage.getItem("cities")) {
        cityList = JSON.parse(localStorage.getItem("cities"));
        var lastIndex = cityList.length - 1;

        listArray();

        if (cityList.length !==0) {
            getWeather(city[lastIndex]);
            weatherContentEl.removeClass("hide");
        }
    }
} 

function clearButton() {
    if (searchListEl.text() !== "") {
        clearEl.removeClass("hide");
    }
}



