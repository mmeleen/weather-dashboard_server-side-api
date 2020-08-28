cities = ["Austin", "New York", "London"]
// displayWeather function re-renders the HTML to display the appropriate content
function displayWeather() {

  var city = $(this).attr("data-name");
  var currentQueryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=6c814b3476e3dccefc544cd800fb5edf&units=imperial";

  // AJAX call for current weather
  $.ajax({
    url: currentQueryUrl,
    method: "GET"
  }).then(function (response) {
    console.log(response);
    var name = response.name;
    var lon = response.coord.lon;
    var lat = response.coord.lat;
    console.log(lon, lat);

    var oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon +
      "&exclude=minutely,hourly&appid=6c814b3476e3dccefc544cd800fb5edf&units=imperial";

    // AJAX call for One Call API
    $.ajax({
      url: oneCallUrl,
      method: "GET"
    }).then(function (response) {
      console.log(response);
      // Current weather
      var todayIcon = response.current.weather[0].icon;
      var todayIconUrl = "http://openweathermap.org/img/wn/" + todayIcon + "@2x.png";
      var currentCity = name + "  -  " + moment().format("dddd, MMMM DD");
      var currentTemp = response.current.temp;
      var currentHumid = response.current.humidity;
      var currentWind = response.current.wind_speed;
      var currentUV = response.current.uvi;

      var title = $("<h3>").addClass("card-title").text(currentCity);
      var todayCard = $("<div>").addClass("card");
      var wind = $("<p>").addClass("card-text").text("Wind Speed: " + currentWind + " MPH");
      var humid = $("<p>").addClass("card-text").text("Humidity: " + currentHumid + "%");
      var temp = $("<p>").addClass("card-text").text("Temperature: " + currentTemp + " °F");
      var cardBody = $("<div>").addClass("card-body");
      var img = $("<img>").attr("src", todayIconUrl);
      var uvIndex = $("<p>").text("UV Index: " + currentUV);

      title.append(img);
      cardBody.append(title, temp, humid, wind, uvIndex, futureDate);
      todayCard.append(cardBody);
      $("#today-div").append(todayCard);



    });


  });

}

// Function for displaying search history list
function renderButtons() {

  // Deleting the cities prior to adding new cities
  $("#buttons-list").empty();

  // Looping through the array of movies
  for (var i = 0; i < cities.length; i++) {

    // Then dynamicaly generating buttons for each city in the array
    var a = $("<button>");
    // Adding a class of city-btn to our button
    a.addClass("city-btn");
    // Adding a data-attribute
    a.attr("data-name", cities[i]);
    // Providing the initial button text
    a.text(cities[i]);
    // Adding the button to the buttons-view div
    $("#buttons-list").append(a);
  }
}

// This function handles events where a city button is clicked
$("#search-btn").on("click", function (event) {
  event.preventDefault();
  // This line grabs the input from the textbox
  var city = $("#city-input").val().trim();
  $("#city-input").val("");

  // Adding city from the textbox to our array
  if (cities.indexOf(city) === -1) {
    cities.push(city);
    window.localStorage.setItem("cities", JSON.stringify(cities));

    // Calling renderButtons which handles the processing of our cities array
    renderButtons();
  }
});

// Adding a click event listener to all elements with a class of "city-btn"
$(document).on("click", ".city-btn", displayWeather);

// Calling the renderButtons function to display the initial buttons
var cities = JSON.parse(window.localStorage.getItem("cities")) || ["Austin", "New York", "London"];
renderButtons();

