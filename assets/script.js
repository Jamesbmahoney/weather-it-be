var apiKey = "b7df24583d533f6d77955dd6376b065c";

var textInputEl = $("#text-input")

$("#btn").on("click", function(event) {    
    event.preventDefault();
    // $("#text-input").val()
    console.log(textInputEl.val());

    var cityName = textInputEl.val();
    getCityName(cityName);
})

function getCityName(cityName) {    
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey;
    fetch(apiUrl)
    .then(function(response){ 
     if (response.ok) {
         response.json().then(function(data){
             console.log(data);
             var lat = data.coord.lat;
             var lon = data.coord.lon;
             getFiveDay(lat, lon);
         })            
     }
      });
}

function getFiveDay(lat, lon){
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;
    fetch(apiUrl)
    .then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                console.log(data);
                displayWeather(data.daily);

                var dailyWeatherEl = document.createElement("span");
                


                
            })
        }
    });
}

function displayWeather(weather){
    for (var i = 0; i < weather.length; i++) {
        var dailyTemp = weather[i].temp.day;
        var dailyHumid = weather[i].humidity;
        var dailyWS = weather[i].wind_speed;
        var dailyUV = weather[i].uvi; 

        console.log(dailyTemp, dailyHumid, dailyWS, dailyUV);
    }
}


