/*jslint browser: true*/
/*global $, jQuery, alert, func*/
/*jslint plusplus: true */

// Settings
var breakpoint = 1023, // unit in px
    days = 1, // Number of days the app is showing

// Settings - END

// Vars for weather API
    // Temerature
    tempC0,
    tempC1,
    tempC2,
    tempC3,
    tempF0,
    tempF1,
    tempF2,
    tempF3,
    
    // Wind
    winddir0,
    winddir1,
    winddir2,
    winddir3,
    
    winddirABB0,
    winddirABB1,
    winddirABB2,
    winddirABB3,
    
    windchillC0,
    windchillC1,
    windchillC2,
    windchillC3,
    windchillF0,
    windchillF1,
    windchillF2,
    windchillF3,
    
    windspeedC0,
    windspeedC1,
    windspeedC2,
    windspeedC3,
    windspeedF0,
    windspeedF1,
    windspeedF2,
    windspeedF3,
    
    // UV Index
    uv0,
    uv1,
    uv2,
    uv3,
    
    // Sunrise / Sunset
    sunrise0,
    sunrise1,
    sunrise2,
    sunrise3,
    
    sunset0,
    sunset1,
    sunset2,
    sunset3,
    
    // Rain
    rainAC,
    rainAC0 = 0,
    rainAC1 = 0,
    rainAC2 = 0,
    rainAC3 = 0,
    rainACC0 = 0,
    rainACC1 = 0,
    rainACC2 = 0,
    rainACC3 = 0,
    rainACF0 = 0,
    rainACF1 = 0,
    rainACF2 = 0,
    rainACF3 = 0;
    
// Vars for weather API - END

// Get position
function getLocation() {
    if (window.location.hash) {
        parsePosition();
    } else {
        insertInHtml("Getting your location", "#loadingStatus");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(parsePosition);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }
}
// Get position -END

//Parse position
function parsePosition(position) {
    insertInHtml("Getting weather conditions", "#loadingStatus");
    var wwo = "http://api.worldweatheronline.com/free/v2/weather.ashx?q=",
        mode = "&format=json&num_of_days=4&includelocation=yes",
        key =  "&key=82594deb029ae9095181418b6edfd";
    if (window.location.hash) {
        var query = window.location.hash.replace("#", ""),
            url = wwo + query + mode + key;
        $("#searchInput").val(window.location.hash.replace("#", ""));
    } else {
        var lati = position.coords.latitude,
        longi = position.coords.longitude,
        url = wwo + lati + "," + longi + mode + key;
//        var url = wwo + 55.654385 + "," + 12.5915103 + mode + key;  //For developments purposes
    }

    $.getJSON(url, function (json) {
        if (!json.data.hasOwnProperty('error')) {
            
            // Location
            var cityName = json.data.nearest_area[0].areaName[0].value,
                country = json.data.nearest_area[0].country[0].value,
                location = cityName + ", " + country;
            insertInHtml(location, ".location");
            
            // Weather
            for (d = 0; d < days; d++) {
                eval("tempC" + d + " = json.data.weather[" + d + "].maxtempC;");
                eval("tempF" + d + " = json.data.weather[" + d + "].maxtempF;");
                
                eval("sunrise" + d + " = json.data.weather[" + d + "].astronomy[0].sunrise;");
                eval("sunset" + d + " = json.data.weather[" + d + "].astronomy[0].sunset;");
                eval("uv" + d + " = json.data.weather[" + d + "].uvIndex;");
                
                eval("windspeedC" + d + " = json.data.weather[" + d + "].hourly[4].windspeedKmph;");
                eval("windspeedC" + d + " =  + (windspeedC" + d + " * 1000) / 3600;"); // m/s
                eval("windspeedF" + d + " = json.data.weather[" + d + "].hourly[4].windspeedMiles;");
                
                eval("windchillC" + d + " = json.data.weather[" + d + "].hourly[4].WindChillC;");
                eval("windchillF" + d + " = json.data.weather[" + d + "].hourly[4].WindChillF;");
                
                eval("winddir" + d + " = json.data.weather[" + d + "].hourly[4].winddirDegree;");
                eval("winddirABB" + d + " = json.data.weather[" + d + "].hourly[4].winddir16Point;");
            }
            var rainDay,
                rainHour;
            for (d = 0; d < days; d++) {
                for (i = 0; i < 8; i++) {
                    rainHour = json.data.weather[d].hourly[i].precipMM;
                    eval("rainAC" + d + " += " + Number(rainHour) + ";");
                }
                rainDay = "day" + d;
                eval("rainACC" + d + " += " + "Math.round(rainAC" + d + " * 100) / 100;");
                eval("rainACF" + d + " += Math.round(rainAC" + d + "/25.4 * 100) / 100;");
            }
            insertTemperature();
            for (d = 0; d < days; d++) { // Insert rain
            }
             
        } else {
            insertInHtml("Couldn't find your location", ".location");
            insertInHtml(":", "#degrees0");
            insertInHtml(":", "#degrees1");
            insertInHtml(":", "#degrees2");
            insertInHtml(":", "#degrees3");
        }
    });
}
//Parse position - END

//Insert data
function insertInHtml(variable, id) {
    $(id).html(variable);
}
//Insert data - END

// Weekday handler
function WeekDay() {
    var x = 1;
    for (i = 0; i < 2; i++) {
        var d = new Date(),
            weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
        weekday[7] = "Sunday";
        weekday[8] = "Monday";
        weekday[9] = "Tuesday";
        var n = weekday[d.getDay() + i + 2];
        x = x + 1;
//        document.getElementById('weekday' + x).innerHTML = n;
    }
}
// Weekday handler - END

$("#searchForm").submit(function (e) {
    var hashtag = $("#searchInput").val();
    window.location.href = '#' + hashtag;
    location.reload();
    return false;
});


function searchBar() {
    $("#searchIcon").click(function () {
        $("#searchForm").addClass("searchActive");
        $("#searchInput").focus();
        $("#searchInput").focusout(function () {
            $("#searchForm").removeClass("searchActive");
        });
    });
}

// Insert temperature
function insertTemperature() {
    for (d = 0; d < days; d++) {
        if ($("#degree input:checked").length) {
            insertInHtml(eval("tempF" + d) + "°", "#degrees" + d);
            insertInHtml(eval("rainACF" + d) + " in", " #precipitation" + d);
            insertInHtml(Math.round(eval("windspeedF" + d)) + " mph", ".wind-force");
        } else {
            insertInHtml(eval("tempC" + d) + "°", "#degrees" + d);
            insertInHtml(eval("rainACC" + d) + " mm", " .precipitation");
            insertInHtml(Math.round(eval("windspeedC" + d)) + " ms", ".wind-force");
        }
    }
}
// Insert temperature - END

// Mobile Keyboard resize fix 
function keyboardCheck() {
    if ($(document.activeElement).attr('type') === 'search') {
        setSlideWidth();
    } else {
        setSlideHeight();
        setSlideWidth();
    }
}
// Mobile Keyboard resize fix -END

function graphicalHeight() {
    var graphicalWidth = $(".graphical").width();
    $(".graphical").css("height", graphicalWidth);
}

//function setSlideHeight() {
//    var windowHeight = $(window).height();
//    if ($(window).width() > breakpoint) {
//        $(".page").css("height", (windowHeight - 57) + "px");
//    } else {
//        $(".page").css("height", (windowHeight) + "px");
//    }
//}

// Click
function clickEvents() {
    searchBar();
}
// Click - END

// Ready
$(document).ready(function () {
//    parsePosition(); // For developments purposes
    getLocation();
    WeekDay();
    clickEvents();
    graphicalHeight();
});
// Ready - END

// Resize
$(window).resize(function () {
    keyboardCheck();
});
//Resize - END