weatherApp();

function weatherApp(){
//gets "weather" array for search buttons from localstorage OR creates a default array if one does not exist, declares variables used in API call.
var cities = (JSON.parse(localStorage.getItem("weather")) || ["Kansas City", "San Diego", "Honolulu", "St. Louis"])
var APIKey = "83df096b794f8f9c6911f7ddaae5235f";
var userCity = $('#userCity').val();

//if the search box is place, adds a placeholder and runs an API call for 'Kansas City' by default
if (userCity === "") {
    var userCity = 'Kansas City'
    $('#userCity').attr('placeholder', 'Enter City Name')
    var queryCurrent = "https://api.openweathermap.org/data/2.5/weather?q="+ userCity +"&appid=" + APIKey;
    var query5day = "https://api.openweathermap.org/data/2.5/forecast?q="+ userCity +"&appid=" + APIKey;
} 
// if city is entered, runs API call for that city name
else {
var queryCurrent = "https://api.openweathermap.org/data/2.5/weather?q="+ userCity +"&appid=" + APIKey;
var query5day = "https://api.openweathermap.org/data/2.5/forecast?q="+ userCity +"&appid=" + APIKey;
}

currentDay = moment().format('M/D/YY');
//Queries weather data for the current day and generates buttons for each city that has been searched
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
    // grabs latitude and longitude from query response and plugs them into the 5 day weather forcast query
    var lat = (response.coord.lat);
    var lon = (response.coord.lon);

    var queryUV = "https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey +"&lat="+ lat+"&lon=" + lon;
        $.get(queryUV).then(function(response) {

            $('.UV').html("UV Index: " + response.value)

            if(response.value >3 && response.value < 6) {
                $('.UV').css('color','black');
                $('.UV').css('background-color','yellow');
            }
            else if (response.value >5 && response.value < 8) {
                $('.UV').css('color','black');
                $('.UV').css('background-color','orange');
            }
            else if (response.value >7 && response.value < 11){
                $('.UV').css('color','black');
                $('.UV').css('background-color','coral');
            }
            else if (response.value > 10) {
                $('.UV').css('background-color','red');
                $('.UV').css('color','white');
            }
            else {
                $('.UV').css('color','black');
                $('.UV').css('background-color','none');
            }
        })
    //displays weather data and icons for weather status
        $('.city').html('<h1>' + response.name +",  ("+ currentDay +")"+'</h1>' + '<img src=images/' + response.weather[0].icon +'.png>');
        $('.coord').html("(Latitude: " + lat + "  Longitude: " + lon +")");
        $('.wind').html("Wind Speed: "+ response.wind.speed + ' mph');
  //temp conversion from Kelvin
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

    // set click event to check if input is empty, if not, runs the "weatherApp" function again with new user entry. 
$("#searchBtn").on("click", function (event) {
    event.preventDefault();
    userCity = $('#userCity').val()
    weatherApp();
    if (userCity === "") {
        alert("Please enter a city name")
    }
    else{ // adds user's entry to array of past entries and removes duplicate entries
    var userCity = $('#userCity').val();
    cities.push(userCity);
    let citiesFilt = [...new Set(cities)];
    localStorage.setItem("weather", JSON.stringify(citiesFilt))
    }
});
}

