// // Using the Google Map Places API we can search for place information using a variety of categories
// // DOCUMENTATION: https://developers.google.com/places/web-service/search

// Create the script tag, set the appropriate attributes
// When the script is executed, it will call the function specified using the callback parameter.
var script = document.createElement("script");
script.src =
  "https://maps.googleapis.com/maps/api/js?key=" +
  apiKey +
  "&callback=initMap&language=en";
script.defer = true;

var apiKey = "AIzaSyCDc0taB-xvtVNgxHt7bFjBHAhq82tUbL4";

// Create the script tag, set the appropriate attributes
// When the script is executed, it will call the function specified using the callback parameter.
var script = document.createElement("script");
script.src =
  "https://maps.googleapis.com/maps/api/js?key=" +
  apiKey +
  "&callback=initMap&language=en";
script.defer = true;

// Attach your callback function to the `window` object
window.initMap = function () {
  // The location of San Francisco
  const initialPosition = { lat: 37.7749, lng: -122.4194 };

  // Create a new map inside of the given HTML div with id="map"
  var map = new google.maps.Map(document.getElementById("map"), {
    // There are two required options for every map: center and zoom.
    // The map, centered at the initial position
    center: initialPosition,
    zoom: 13,
  });

  // The marker, positioned at the user's current location
  const myLocationMarker = new google.maps.Marker({
    map: map, // your google.maps.Map object,
    position: initialPosition,
  });

  // add event listener to the marker so that when clicked on an infowindow pops up
  myLocationMarker.addListener("click", function () {
    var infowindow = new google.maps.InfoWindow();
    infowindow.open(map, myLocationMarker);
    infowindow.setContent("Your Current Location");
  });

  // Get the users current location
  if (navigator.geolocation) {
    // Browser supports Geolocation
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log(
        `Current Location: Latitude = ${position.coords.latitude}, Longitude = ${position.coords.longitude}`
      );

      // We use the marker’s setPostion() method to change the location of the marker
      myLocationMarker.setPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });

      // we also use the map’s panTo() method to center the map to user’s location
      map.panTo({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });

      // once the map is loaded to the users location the loading symbol dissappears
      $("#loading").addClass("hide");

      const url =
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
        position.coords.latitude +
        "," +
        position.coords.longitude +
        "&radius=5000&type=grocery_or_supermarket&keyword=grocery&key=" +
        apiKey;
      const proxyurl = "https://cors-anywhere.herokuapp.com/";

      // fetch the nearby grocery stores
      fetch(proxyurl + url).then(function (response) {
        if (!response.ok) {
          console.log("Looks like there was a problem. " + response.statusText);
          return;
        }
        // Examine the text in the response
        response
          .json()
          .then(function (data) {
            console.log(data);
            var stores_array = [];
            var store = {};
            for (var i = 0; i < data.results.length; i++) {
              const contentString =
                '<h3 id="firstHeading" class="firstHeading">' +
                data.results[i].name +
                "</h3>" +
                '<div id="bodyContent">' +
                "<p><b>Address: </b>" +
                data.results[i].vicinity +
                "</br>" +
                "<b>Distance: </b>";
              const infowindow = new google.maps.InfoWindow({
                content: contentString,
              });

              const marker = new google.maps.Marker({
                position: data.results[i].geometry.location,
                map: map,
                icon: {
                  url: data.results[i].icon,
                  scaledSize: new google.maps.Size(40, 40),
                },
                title: data.results[i].name,
              });

              marker.addListener("click", function () {
                {
                  infowindow.setContent(contentString);
                  infowindow.open(map, marker);
                }
                setTimeout(function () {
                  infowindow.close();
                }, 5000);
              });

              store = {
                name: data.results[i].name,
                is_open: data.results[i].opening_hours.open_now,
                address: data.results[i].vicinity,
                lat: data.results[i].geometry.location.lat,
                lat: data.results[i].geometry.location.lng,
              };
              stores_array.push(store);
            }
            console.log(stores_array);
            displayStores(stores_array);
          })
          .catch(function (err) {
            console.error("Fetch Error: ", err);
          });
      });
    }),
      // if there is an error
      function (error) {
        // Browser doesn't support Geolocation
        alert(`Error (${error.code}): ${error.message}`);
      };
  } else {
    alert("Geolocation is not supported by your browser.");
  }
};
// Append the 'script' element to 'head'
document.head.appendChild(script);

var displayStores = function (resultArray) {
  // print store list to the screen
  if (resultArray.length === 0) {
    $("#store_list").append(
      `<p>There is no grocery stores within a 5,000 meter radius of your location</p>`
    );
    return;
  }
  for (var i = 0; i < resultArray.length; i++) {
    if (resultArray[i].is_open === true) {
      $("#store_list").append(
        `<div id="name">${resultArray[i].name} , address: ${resultArray[i].address}<\div>`
      );
      console.log(resultArray[i].is_open);
    }
  }
};
