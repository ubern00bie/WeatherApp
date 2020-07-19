weatherApp();
function weatherApp(){

var cities = (JSON.parse(localStorage.getItem("weather")) || ["Kansas City", "San Diego", "Honolulu", "St. Louis"])
var APIKey = "83df096b794f8f9c6911f7ddaae5235f";
var userCity = $('#userCity').val();

if (userCity === "") {
    var userCity = 'Kansas City'
    $('#userCity').attr('placeholder', 'Enter City Name')
    var queryCurrent = "https://api.openweathermap.org/data/2.5/weather?q="+ userCity +"&appid=" + APIKey;
    var query5day = "https://api.openweathermap.org/data/2.5/forecast?q="+ userCity +"&appid=" + APIKey;
}
else {
var queryCurrent = "https://api.openweathermap.org/data/2.5/weather?q="+ userCity +"&appid=" + APIKey;
var query5day = "https://api.openweathermap.org/data/2.5/forecast?q="+ userCity +"&appid=" + APIKey;
}

currentDay = moment().format('M/D/YY');

$.get(queryCurrent).then(function(response) {
    $('.cityList').empty();
  
    for (var i = 0; i < cities.length; i++) {
        var $cityButton = $('<button>');
        $('.cityList').append($cityButton);
        $cityButton.attr('class','cityBtn');
        $cityButton.text(cities[i])
    }

    $('.cityBtn').click( function() {
        $('#userCity').val($(this).html())
        console.log($(this).html())
        weatherApp()
    })
    
  var lat = (response.coord.lat);
  var lon = (response.coord.lon);

  var queryUV = "http://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey +"&lat="+ lat+"&lon=" + lon;
    $.get(queryUV).then(function(response) {

        $('.UV').html("UV Index: " + response.value)

        if(response.value >3 && response.value < 6) {
            $('.UV').css('background-color','yellow');
        }
        else if (response.value >5 && response.value < 8) {
            $('.UV').css('background-color','orange');
        }
        else if (response.value >7 && response.value < 11){
            $('.UV').css('background-color','coral');
        }
        else if (response.value > 10) {
            $('.UV').css('background-color','red');
            $('.UV').css('color','white');
        }
        else {
            $('.UV').css('');
        }
    })
  $('.city').html('<h1>' + response.name +",  ("+ currentDay +")"+'</h1>' + '<img src=images/' + response.weather[0].icon +'.png>');
  $('.coord').html("(Latitude: " + lat + "  Longitude: " + lon +")");
  $('.wind').html("Wind Speed: "+ response.wind.speed + ' mph');
  
  var tempF = ((response.main.temp -273.15)* 1.80 + 32).toFixed(2);
  $('.temp').html("Temperature: " + tempF + "&#176F")
  $('.humidity').html("Humidity: "+ response.main.humidity +"%")
})

$.get(query5day).then(function(response) {
    //set 5 day forcast
 var count = 0;
    for(var i = 0; i < 5; i++) {        
        $('.date'+ i).html(response.list[count].dt_txt)
        $('.img'+ i).attr('src', "images/" + response.list[count].weather[0].icon + ".png")
        var tempF = ((response.list[count].main.temp -273.15)* 1.80 + 32).toFixed(2);
        $('.temp'+ i).html("Temp: " + tempF + "&#176F")
        $('.hum'+ i).html("Humidity: " + response.list[count].main.humidity +"%")
        count = count + 8;
    }
})

$("#searchBtn").on("click", function (event) {
    event.preventDefault();
    userCity = $('#userCity').val()
    weatherApp();
    if (userCity === "") {
        alert("Please enter a city name")
    }
    else{
    var userCity = $('#userCity').val();
    cities.push(userCity);
    let citiesFilt = [...new Set(cities)];
    localStorage.setItem("weather", JSON.stringify(citiesFilt))
    console.log("cities:" + citiesFilt)
    }
});
}

