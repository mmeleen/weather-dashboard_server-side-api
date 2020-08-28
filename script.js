cities = ["Austin", "New York", "London"]
// displayWeather function re-renders the HTML to display the appropriate content
function displayWeather(city) {

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
      $("#today-div").empty();
      var todayIcon = response.current.weather[0].icon;
      var todayIconUrl = "http://openweathermap.org/img/wn/" + todayIcon + "@2x.png";
      var currentCity = name + "  -  " + moment().format("dddd, MMMM DD");
      var currentTemp = response.current.temp;
      var currentHumid = response.current.humidity;
      var currentWind = response.current.wind_speed;
      var currentUV = response.current.uvi;

      var title = $("<h3>").addClass("card-title").text(currentCity);
      var todayCard = $("<div>").addClass("card bg-primary");
      var wind = $("<p>").addClass("card-text").text("Wind Speed: " + currentWind + " MPH");
      var humid = $("<p>").addClass("card-text").text("Humidity: " + currentHumid + "%");
      var temp = $("<p>").addClass("card-text").text("Temperature: " + currentTemp + " °F");
      var cardBody = $("<div>").addClass("card-body");
      var img = $("<img>").attr("src", todayIconUrl);
      var uvIndex = $("<p>").text("UV Index: " + currentUV);

      cardBody.append(title, img, temp, humid, wind, uvIndex);
      todayCard.append(cardBody);
      $("#today-div").append(todayCard);

      // 5-Day
      $("#five-day-div").empty();
      for (let i = 1; i < 6; i++) {

        let futureDate = moment().add(i, 'days').format("MMM DD");
        let futureIcon = response.daily[i].weather[0].icon;
        let futureIconUrl = "http://openweathermap.org/img/wn/" + futureIcon + "@2x.png";
        let futureTemp = response.daily[i].temp.max;
        let futureHumid = response.daily[i].humidity;

        let futureCard = $("<div>").addClass("card bg-primary");
        let futureCardBody = $("<div>").addClass("card-body justify-content-center");
        let futureTitle = $("<h5>").addClass("card-title pt-2 text-center").text(futureDate);
        let futureImg = $("<img>").attr("src", futureIconUrl);
        let futureTempEl = $("<p>").addClass("card-text").text("Temperature: " + futureTemp + " °F");
        let futureHumidEl = $("<p>").addClass("card-text").text("Humidity: " + futureHumid + "%");

        futureCardBody.append(futureImg, futureTempEl, futureHumidEl);
        futureCard.append(futureTitle, futureCardBody);
        $("#five-day-div").append(futureCard);
      }

    })


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
    cities.unshift(city);
    window.localStorage.setItem("cities", JSON.stringify(cities));

    // Calling renderButtons which handles the processing of our cities array
    renderButtons();
  }
  displayWeather(city);
});

// Adding a click event listener to all elements with a class of "city-btn"
$(document).on("click", ".city-btn", function (city) {
  var city = $(this).attr("data-name");
  displayWeather(city);
});

// Calling the renderButtons function to display the initial buttons
var cities = JSON.parse(window.localStorage.getItem("cities")) || ["Austin", "New York", "London"];
renderButtons();
displayWeather(cities[0]);

