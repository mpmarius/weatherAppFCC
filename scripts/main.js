'use strict';

var appId = 'f5b8cf8a44d1f85331b87e9f7b361caf/',
    apiUrl = 'https://api.forecast.io/forecast/',
    longitude = '',
    latitude = '',
    $unit = $('#unit'),
    $main = $('#main'),
    $temp = $('#temp'),
    weatherIcon,
    $city = $('#city'),
    options = {
    enableHighAccuratie: true,
    timeout: '7000',
    maximumAge: 0
};

//get data from forecast.io

function getWeather() {
    'use strict';

    $.ajax({
        url: apiUrl + appId + latitude + ',' + longitude,
        dataType: 'jsonp',
        jsonpCallback: 'weatherData',
        type: 'GET'
    }).fail(function Error() {
        alert('cannot connect to weather API');
    });
}

//get city name from google because forecast.io does not provide city name

function getCityName() {
    'use strict';

    var keyGoogle = 'AIzaSyBmCk28nEs1OWXgwS0VQ1752o_cYwrkxHs',
        url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=',
        location = latitude + ',' + longitude;

    $.ajax({
        url: url + location,
        type: 'GET',
        dataType: 'json',
        data: {
            //location_type: 'GEOMETRIC_CENTER',
            key: keyGoogle
        }
    }).done(function (googleResponse) {
        $city.text(googleResponse.results[0].formatted_address);
    }).fail(function (googleResponse) {
        Materialize.toast('Cannot get City Name from google', 600);
    });
}

//get browser location && initialize GetWeather Api
function coordsSucces(pos) {
    'use strict';

    var crd = pos.coords;
    latitude = crd.latitude;
    longitude = crd.longitude;
    getWeather();
    getCityName();
}

function coordsError(err) {
    'use strict';

    Materialize.toast('Cannot get location ' + err.message, 6000);
}

//Increments Temperature value
function changeTemp(temp, unit) {
    'use strict';

    var count = parseInt($temp.text()),
        $unit = $('#unit');

    $unit.text(unit);
    $('#metrics').attr('disabled', true)
    if (count < temp) {
        var interval = setInterval(function () {
            $temp.text(count++);
            if (count === temp) {
                clearInterval(interval);
                $('#metrics').attr('disabled', false)
            }
        }, 30);
    } else {
        var interval = setInterval(function () {
            $temp.text(count--);
            if (count === temp) {
                clearInterval(interval);
                $('#metrics').attr('disabled', false)
            }
        }, 30);
    }
}

//forecast function process the data//
function weatherData(forecast) {
    'use strict';

    var forecastIcons = new Skycons({ 'color': 'gray' });
    var tempF = Math.floor(forecast.currently.temperature);
    var tempC = Math.floor((tempF - 32) / 1.8);
    $city.attr('placeholder', forecast.name); //city
    $main.text(forecast.currently.summary); // Weather Description
    weatherIcon = forecast.currently.icon;
    forecastIcons.set('weather_icon', weatherIcon);
    forecastIcons.play();
    changeTemp(tempC, 'C');
    changeBgColor(tempC);
    changeWeatherImage(weatherIcon);
}
// change temperature metric-imperial
function setMetrics() {
    'use strict';

    if ($('#metrics').is(':checked')) {
        var count = parseInt($temp.text()),
            tempF = Math.floor(count * 1.8 + 32);
        changeTemp(tempF, 'F');
    } else {
        var count = parseInt($temp.text()),
            tempC = Math.floor((count - 32) / 1.8);
        changeTemp(tempC, 'C');
    }
}

//change bg color based on temperature

function changeBgColor(temp) {
    'use strict';

    var position = temp * 2.5;
    if (position < 0) {
        position = 0;
    } else if (position > 100) {
        position = 100;
    }
    $('body').css('background-position', position + '%');
}

// Change Weather image

function changeWeatherImage(icon) {
  'use strict'
    var image = {
        clear_night: 'clear-night',
        clear_day: 'clear-day',
        cloudy: ['partly-cloudy-day', 'partly-cloudy-night', 'fog', 'cloudy', 'wind'],
        snow: ['snow', 'sleet'],
        rain: ['rain', 'drizzle']
    };
    $.map(image, function(value, key) {
        if (value === icon || key.indexOf(icon) !== -1) {
            $('.weather-image').css('background-image', 'url(\'../images/' + key + '.jpg\')');
        }
    });

}

$(document).ready(function () {
    'use strict';

    navigator.geolocation.getCurrentPosition(coordsSucces, coordsError, options);
    $('#metrics').on('change', setMetrics);
});
//# sourceMappingURL=main.js.map
