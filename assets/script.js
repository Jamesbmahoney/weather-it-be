var apiKey = "b5521588823531ae4d680a21d0efd6ca";

var textInputEl = $("#text-input");


$("#btn").on("click", function (event) {
    event.preventDefault();
    // $("#text-input").val()
    console.log(textInputEl.val());

    var cityName = textInputEl.val();
    getWeather(cityName);
})

function getWeather(cityName) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey;
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    var lat = data.coord.lat;
                    var lon = data.coord.lon;
                    getDailyDay(lat, lon);
                    getFiveDay(lat, lon);

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
                    console.log(data);
                    displayWeatherDaily(data.current);                   
                })
            }
        });
}

function getFiveDay(lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    displayWeatherFiveDay(data.daily);
                })
            }
        });
}

function displayWeatherDaily(weather) {
    for (var i = 0; i < weather.length; i++) {
        var dailyTemp = weather[i].temp.day;
        var dailyHumid = weather[i].humidity;
        var dailyWS = weather[i].wind_speed;
        var dailyUV = weather[i].uvi;

        console.log(dailyTemp, dailyHumid, dailyWS, dailyUV);

        var cityName = textInputEl.val();

        document.getElementById("city").innerHTML = cityName;
        document.getElementById("dailytemp").innerHTML = "Temp: " + Number(dailyTemp).toFixed(1) + "°";
        document.getElementById("dailyhumid").innerHTML = "Humidity: " + Number(dailyHumid).toFixed(1) + "%";
        document.getElementById("dailyws").innerHTML = "Wind Speed: " + Number(dailyWS).toFixed(1);
        document.getElementById("dailyuv").innerHTML = "UV Index: " + Number(dailyUV).toFixed(1);
    }
}

function displayWeatherFiveDay(weather) {
    for (var i = 0; i < weather.length; i++) {
        var fiveDayTemp = weather[i].temp.day;
        var fiveDayHumid = weather[i].humidity;

        console.log(fiveDayTemp, fiveDayHumid);
       
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







