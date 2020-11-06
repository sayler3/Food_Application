// Variables

// var api_key = "a8f7968642917eada65916047ac3150460c0056a";
let ingredients = "placeholder"
// let meal = "beef stew"
let page = ""

// API pulls
// fetch(
//   "https://api.spoonacular.com/food/ingredients/search?apiKey=" +
//     api_key +
//     "&includeNutrition=true"
// )
//   .then(function (response) {
//     if (response.ok) {
//       response.json().then(function (data) {
//         console.log(data);
//       });
//     } else {
//       alert("Error: " + response.statusText);
//     }
//   })
//   .catch((err) => {
//     console.error(err);
//   });

const getRecipe = function(meal) {
  let apiUrl = "https://recipe-puppy.p.rapidapi.com/?q=" + meal;
  let apiInfo = {
    "method": "GET",
    "headers": {
      "x-rapidapi-key": "a1763f65f3mshc9f6db6be3a5287p184f59jsneb238681d7af",
      "x-rapidapi-host": "recipe-puppy.p.rapidapi.com"
    }
  }
  fetch(apiUrl, apiInfo)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

// Functions

// Event listeners
$("#search_button").click(function (event) {
  event.preventDefault();
  let meal = $('#recipe_input').val();
  console.log(meal)
  getRecipe(meal);
});