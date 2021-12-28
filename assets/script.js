var apiKey = "b7df24583d533f6d77955dd6376b065c";
var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=London&units=imperial&appid=" + apiKey;

fetch(apiUrl)
    .then(function(serverPromise){ 
      serverPromise.json()
        .then(function(j) { 
          console.log(j); 
        })
        .catch(function(e){
          console.log(e);
        });
    })
    .catch(function(e){
        console.log(e);
      });
