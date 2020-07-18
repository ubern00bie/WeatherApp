var cities = ["Kansas City", "San Diego", "Honolulu", "St Louis"];
var APIKey = "83df096b794f8f9c6911f7ddaae5235f";
// var userCity = $('#userCity').val()
var userCity = "Kansas City" //for testing
// $('#userCity').val("enter city")
$('#userCity').attr('placeholder', 'Enter city name')
//console.log($('#userCity').val())
$('#day3').find('h5.date').html("something");
var queryCurrent = "https://api.openweathermap.org/data/2.5/weather?q="+ userCity +"&appid=" + APIKey;
var query5day = "https://api.openweathermap.org/data/2.5/forecast?q="+ userCity +"&appid=" + APIKey;
currentDay = moment().format('M/D/YYYY');
// We then created an AJAX call
getWeather();

// $('.cityBtn').click( function() {
//     userCity = this.innerHTML
//     console.log(this)
//     console.log(userCity)
//     getWeather();
// })

function getWeather() {
$.get(queryCurrent).then(function(response) {
    for (var i = 0; i < cities.length; i++) {
        var $cityButton = $('<button>');
        $('.cityList').append($cityButton);
        $cityButton.attr('class','cityBtn');
        $cityButton.text(cities[i])
    }

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
            console.log('low')
            $('.UV').css('');
        }
    })

  console.log("queryCurrent" + response);
  $('.city').html('<h1>' + response.name +",  ("+ currentDay +")"+'</h1>');
  $('.coord').html("(Latitude: " + lat + "  Longitude: " + lon +")");
  $('.wind').html("Wind Speed: "+ response.wind.speed + ' mph');
  
  var tempF = ((response.main.temp -273.15)* 1.80 + 32).toFixed(2);
  $('.temp').html("Temperature: " + tempF + "&#176F")
  $('.humidity').html("Humidity: "+ response.main.humidity +"%")
})

$.get(query5day).then(function(response) {
  console.log("query5day Call",response);
    //set 5 day forcast
 var count = 0;
    for(var i = 0; i < 5; i++) {        
        $('.date'+ i).html(response.list[count].dt_txt)
    var icon = response.list[count].weather[0].main
    //if else to determine icon depicted

        $('.img'+ i).attr('src', "images/" + response.list[count].weather[0].icon + ".png")
        var tempF = ((response.list[count].main.temp -273.15)* 1.80 + 32).toFixed(2);
        $('.temp'+ i).html("Temp: " + tempF + "&#176F")//needs temp conversion
        $('.hum'+ i).html("Humidity: " + response.list[count].main.humidity +"%")
        count = count + 8;
    }
})
}

$("#searchBtn").on("click", function (event) {
    event.preventDefault();
    var $userCity = $("#city-input").val();
    cities.push($userCity);
    localStorage.setItem("weather", JSON.stringify(cities))
    //don't allow undefined pushes
    console.log(cities)
});

  // Create CODE HERE to Log the queryURL
//   var newvar = $.get(queryCurrent);
 //weather dashboard
            //presented with last searched city

  //search history
            //current & future weather conditions
 
  // Create CODE HERE to log the resulting object
  //future conditions
            //5 day forcast, date, icon for weather cond, temp & humidity
    //current weather - city name, the date, icon representation of weather conditions, temperature, humidity, wind speed, UV index
            //UV index - color that indicates favorable, moderate, or severe