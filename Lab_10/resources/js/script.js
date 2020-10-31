// ZIQI ZHAO for CSCI-3308 Lab 10 
// University of Colorado at Boulder

//helper functions
var dayOfWeek = "";
function formatDate(date, month, year) {
    month = (month.length < 2) ? ('0' + month) : month;
    date = (date.length < 2) ? ('0' + date) : date;
    return [year, month, date].join('-');
}
function getDayofWeek(date, month, year) {
    var week_names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    dayOfWeek = week_names[new Date([month, date, year].join('-')).getDay()];
}
function getFarenheitTemp(temp) {
    return (9 * temp / 5) + 32;
}
function loadPage(coordinate) {
    var u_latitude = coordinate[0]
    var u_longtitude = coordinate[1]
    var url = 'https://api.weatherstack.com/forecast?access_key=5bc82451636190abd9d7afe6fe9b20b5&query=' + u_latitude + ',' + u_longtitude + '&forecast_days=5';

    $.ajax({ url: url, dataType: "jsonp" }).then(function (data) {
        console.log(data);

        document.getElementById('image_today').src = data.current.weather_icons;

        document.getElementById('heading').innerHTML = "Today's Weather Forecast - " + data.location.name;

        var temperature_C = data.current.temperature;

        var temperature_F = getFarenheitTemp(temperature_C);

        var temp_for_thermometer = temperature_F

        document.getElementById('temp_today').innerHTML = temperature_F + " ºF";

        if (temp_for_thermometer > 100) {
            temp_for_thermometer = 100;
        }

        if (temp_for_thermometer < 0) {
            temp_for_thermometer = 0;
        }
        document.getElementById('thermometer_inner').style.height = temp_for_thermometer + "%";

        var color = "grey";

        if (temp_for_thermometer > 85) {
            color = "red";
        }

        else if (temp_for_thermometer < 65) {
            color = "blue";
        }
        document.getElementById('thermometer_inner').style.background = color;

        document.getElementById('precip_today').innerHTML = data.current.precip + " mm";

        document.getElementById('humidity_today').innerHTML = data.current.humidity + "%";

        document.getElementById('wind_today').innerHTML = data.current.wind_speed + " mph";

        document.getElementById('summary_today').innerHTML = data.current.weather_descriptions;

        document.getElementById('local_time').innerHTML = data.location.localtime;
        /*
          Read the current weather information from the data point values [https://weatherstack.com/documentation] to
          update the webpage for today's weather:
          1. image_today : This should display an image for today's weather.
                   This will use the icon that is returned by the API. You will be looking for the weather_icons key in the response.
    
          2. location: This should be appended to the heading. For eg: "Today's Weather Forecast - Boulder"
    
          3. temp_today : This will be updated to match the current temperature. Use the getFarenheitTemp to convert the temperature from celsius to farenheit.
    
          4. thermometer_inner : Modify the height of the thermometer to match the current temperature. This means if the
                       current temperature is 32 F, then the thermometer will have a height of 32%.  Please note,
                       this thermometer has a lower boundary of 0 and upper boundary of 100.
    
          5. precip_today : This will be updated to match the current probability for precipitation. Be sure to check the unit of the value returned and append that to the value displayed.
    
          6. humidity_today : This will be updated to match the current humidity percentage (make sure this is listed as a
                    percentage %)
    
          7. wind_today : This will be updated to match the current wind speed.
    
          8. summary_today: This will be updated to match the current summary for the day's weather.
    
        */
        //helper function - to be used to get the key for each of the 5 days in the future when creating cards for forecasting weather
        function getKey(i) {
            var week_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            dayOfWeek = week_names[new Date(Object.keys(data.forecast)[i]).getDay()];
            return data.forecast[Object.keys(data.forecast)[i]];
        }

        for (var i = 0; i < 5; i++) {
            var Max = getFarenheitTemp(getKey(i).maxtemp);
            var Min = getFarenheitTemp(getKey(i).mintemp);
            var Sun_rise = getKey(i).astro.sunrise;
            var Sun_set = getKey(i).astro.sunset;
            document.getElementById('5_day_forecast').innerHTML +=
                `<div style="width: 20%;"">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title"> ${dayOfWeek} </h5>
                <p class="card-text">
                  High: ${Max} ºF <br>
                  Low: ${Min} ºF <br>
                  Sunrise: ${Sun_rise} <br>
                  Sunset: ${Sun_set} <br>
              </div>
            </div>
          </div>`
        }
        /* Process the daily forecast for the next 5 days */

        /*
          For the next 5 days you'll need to add a new card listing:
            1. The day of the week
            2. The temperature high
            3. The temperature low
            4. Sunrise
            5. Sunset
    
          Each card should use the following format:
          <div style="width: 20%;">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title"><!-- List Day of the Week Here --></h5>
                <p class="card-text">High:<!--List Temperature High --> <br>
                  Low: <!-- List Temperature Low --><br>
                  Sunrise: <!-- List Time of Sunrise --><br>
                  Sunset: <!-- List Time of Sunset --></p>
              </div>
            </div>
          </div>
    
          <Hint1 - To access the forecast data> You need to make sure to carefully see the JSON response to see how to access the forecast data. While creating the key to access forecast data make sure to convert it into a string using the toString() method.
    
          <Hint2 - To add the cards to the HTML> - Make sure to use string concatenation to add the html code for the daily weather cards.  This should
          be set to the innerHTML for the 5_day_forecast.
        */
    })
}


function check_coordinate() {
    var latitude = document.getElementById('latitudeinput').value;
    var longtitude = document.getElementById('Longitudeinput').value;
    if(latitude > 90 || latitude < -90 || longtitude > 180 || longtitude < -180){
      alert("Please enter the latitude between -90 to 90 and longtitude between -180 to 180.");
      return;
    }
    else{
      var coordinate = [latitude, longtitude];
      document.getElementById('5_day_forecast').innerHTML="";
      console.log(coordinate);
      loadPage(coordinate); 

    }
}

$(document).ready(function () {    // I add something interesting. This part is to get your current location and get weather.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            document.getElementById('latitudeinput').value = pos.coords.latitude;
            document.getElementById('Longitudeinput').value = pos.coords.longitude;
            check_coordinate();
        }, (err) => {
            console.log("Error", err);
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        })
    }
    check_coordinate();
});