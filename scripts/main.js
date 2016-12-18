'use strict';

/* eslint-disable */
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
        console.log('error');
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
            location_type: 'GEOMETRIC_CENTER',
            key: keyGoogle
        }
    }).done(function (googleResponse) {
        console.log(googleResponse);
        $city.text(googleResponse.results[0].formatted_address);
    }).fail(function (googleResponse) {
        console.log(googleResponse);
        Materialize.toast('Cannot get City Name from google', 600);
    });
}

//get browser location && initialize GetWeather Api
function coordsSucces(pos) {
    'use strict';

    var crd = pos.coords;
    latitude = crd.latitude;
    longitude = crd.longitude;
    console.log(latitude + ' ' + longitude);
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

    var count = parseInt($temp.text());
    $unit.text(unit);
    if (count < temp) {
        var interval = setInterval(function () {
            $temp.text(count++);
            if (count === temp) {
                clearInterval(interval);
            }
        }, 30);
    } else {
        var interval = setInterval(function () {
            $temp.text(count--);
            if (count === temp) {
                clearInterval(interval);
            }
        }, 30);
    }
}

//forecast function process the data//
function weatherData(forecast) {
    'use strict';

    var forecastIcons = new Skycons({ 'color': 'gray' });
    var temp = Math.floor(forecast.currently.temperature);
    $city.attr('placeholder', forecast.name); //city
    $main.text(forecast.currently.summary); // Weather Description
    weatherIcon = forecast.currently.icon;
    forecastIcons.set('weather_icon', weatherIcon);
    forecastIcons.play();
    changeTemp(temp, 'F');
    changeBgColor(temp);
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

$(document).ready(function () {
    'use strict';

    navigator.geolocation.getCurrentPosition(coordsSucces, coordsError, options);
    $('#metrics').on('change', setMetrics);
});
//# sourceMappingURL=main.js.map
