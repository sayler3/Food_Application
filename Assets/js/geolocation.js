// // Using the Google Map Places API we can search for place information using a variety of categories
// // DOCUMENTATION: https://developers.google.com/places/web-service/search

// // Search for nearby Grocery Stores
// //

// // function createMarker(place) {
// //   const marker = new google.maps.Marker({
// //     map,
// //     position: place.geometry.location,
// //   });
// //   google.maps.event.addListener(marker, "click", () => {
// //     infowindow.setContent(place.name);
// //     infowindow.open(map);
// //   });
// // }

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
  const map = new google.maps.Map(document.getElementById("map"), {
    // There are two required options for every map: center and zoom.
    // The map, centered at the initial position
    center: initialPosition,
    zoom: 14,
  });

  // The marker, positioned at the user's current location
  const myLocationMarker = new google.maps.Marker({
    map: map, // your google.maps.Map object,
    position: initialPosition,
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
      const url =
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
        position.coords.latitude +
        "," +
        position.coords.longitude +
        "&radius=5000&type=grocery_or_supermarket&keyword=grocery&key=" +
        apiKey;
      getGroceryStores(url);
    }),
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

function getGroceryStores(url) {
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
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
          store = {
            name: data.results[i].name,

            open_hours: data.results[i].opening_hours,
            address: data.results[i].vicinity,
            latlng: data.results[i].geometry.location,
          };
          stores_array.push(store);
        }
        console.log(stores_array);

        // print store list to the screen
        for (var i = 0; i < stores_array.length; i++) {
          $("#store_list").append(
            `<div id="name">${stores_array[i].name} , Is your store open?: ${stores_array[i].open_hours.open_now}, address: ${stores_array[i].address}<\div>`
          );
        }
      })
      .catch(function (err) {
        console.error("Fetch Error: ", err);
      });
  });
}

// create markers at the grocery store locations
function createMarker(place) {
  const infowindow = new google.maps.InfoWindow();
  for (var i = 0; i < stores_array.length; i++) {
    const marker = new google.maps.Marker({
      map,
      position: place.latlng,
    });
    google.maps.event.addListener(marker, "click", function () {
      infowindow.setContent(place.name);
      infowindow.open(map);
    });
  }
}
