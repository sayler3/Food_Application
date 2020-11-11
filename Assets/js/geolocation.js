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

// url =
//   "https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=" +
//   apiKey;
// fetch(url)
//   .then(function (response) {
//     if (response.status !== 200) {
//       console.log(
//         "Looks like there was a problem. Status Code: " + response.status
//       );
//       return;
//     }

//     // Examine the text in the response
//     response.json().then(function (data) {
//       console.log(data);
//     });
//   })
//   .catch(function (err) {
//     console.log("Fetch Error: -S", err);
//   });
