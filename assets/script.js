// Api Key for openweather
var apiKey = "b5521588823531ae4d680a21d0efd6ca";

// Get local date and time
function dateTime() {
    var myDate = new Date();
    var year = myDate.getYear();
    if (year < 1000) {
        year += 1900
    }
    var day = myDate.getDay();
    var month = myDate.getMonth();
    var daym = myDate.getDate();
    var dayArray = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");
    var monthArray = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",);

    var currentTime = new Date();
    var h = currentTime.getHours();
    var m = currentTime.getMinutes();
    var s = currentTime.getSeconds();
    if (h == 24) {
        h = 0;
    } else if (h > 12) {
        h = h - 12;
    }

    if (h < 10) {
        h = "0" + h;
    }

    if (m < 10) {
        m = "0" + m;
    }
    if (s < 10) {
        s = "0" + s;
    }
    // convert date and time into readable text
    var myDate = document.getElementById("currentDay");
    myDate.textContent = "" + dayArray[day] + ", " + monthArray[month] + " " + daym + " " + year + " | " + h + ":" + m + ":" + s;
    myDate.innerText = "" + dayArray[day] + ", " + monthArray[month] + " " + daym + " " + year + " | " + h + ":" + m + ":" + s;

    setTimeout("dateTime()", 1000);
}

// Variables for misc. ID's
var textInputEl = $("#text-input");
var clearEl = $("#clear-btn");
var weatherContentEl = $("#weather-content");
var searchListEl = $("#search-list");

var cityList = [];

// Functions to call the stored city lists
initList();
clearButton();

// On click events for all buttons
$(document).on("submit", function (event) {
    event.preventDefault();

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

searchListEl.on("click", "li.city-btn", function (event) {

    var value = $(this).data("value");

    getWeather(value);
    searchHistory(value);
});

// Functions for calling both local and 5 Day forecasts
function getWeather(cityName) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey;
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    //  console.log(data);            

                    var dailyTemp = data.main.temp;
                    var dailyHumid = data.main.humidity;
                    var dailyWS = data.wind.speed;

                    
                    var cityName = textInputEl.val();

                    document.getElementById("city").innerHTML = cityName;
                    document.getElementById("dailytemp").innerHTML = "Temp: " + Number(dailyTemp).toFixed(1) + "°";
                    document.getElementById("dailyhumid").innerHTML = "Humidity: " + Number(dailyHumid).toFixed(1) + "%";
                    document.getElementById("dailyws").innerHTML = "Wind Speed: " + Number(dailyWS).toFixed(1);

                    document.getElementById("currentimg").src = "https://openweathermap.org/img/wn/" +
                        data.weather[0].icon
                        + ".png";

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
    weather.length = 5;
    console.log (weather.length);
    for (var i = 0; i < weather.length; i++) {
        var fiveDayTemp = weather[i].temp.max;
        var fiveDayHumid = weather[i].humidity;

        // console.log(fiveDayTemp, fiveDayHumid);        
        
        document.getElementById("daytemp" + (i + 1)).innerHTML = "Temp: " + Number(fiveDayTemp).toFixed(1) + "°";
        document.getElementById("dayhumid" + (i + 1)).innerHTML = "Humidity: " + Number(fiveDayHumid).toFixed(1);

        document.getElementById((i + 1) + "img").src = "https://openweathermap.org/img/wn/" +
            weather[i].weather[0].icon
            + ".png";

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


// Save and search history
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
    cityList.forEach(function (city) {
        var searchItem = $('<li class="list-group-item city-btn bg-light bg-gradient border rounded justify-content-start mx-1 my-1">');
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

        if (cityList.length !== 0) {
            getWeather(cityList[lastIndex]);
            weatherContentEl.removeClass("hide");
        }
    }
}

function clearButton() {
    if (searchListEl.text() !== "") {
        clearEl.removeClass("hide");
    }
}

// Calls the time and date at the top of the screen
dateTime();



