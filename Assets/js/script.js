// Variables

// var api_key = "a8f7968642917eada65916047ac3150460c0056a";

// // API pulls
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

const getRecipe = function (meal) {
  let apiUrl = "https://recipe-puppy.p.rapidapi.com/?q=" + meal;
  let apiInfo = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "a1763f65f3mshc9f6db6be3a5287p184f59jsneb238681d7af",
      "x-rapidapi-host": "recipe-puppy.p.rapidapi.com",
    },
  };
  fetch(apiUrl, apiInfo)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          for (var i = 0; i < data.results.length; i++) {
            var recipeName = data.results[i].title;
            console.log(recipeName);
            $("#options")
              .append(`<button style=" width: 200px; height: 300px; padding: 10px; margin: 10px;" class="list-group-item text-left btn btn-outline-secondary" type="button" id="recipe_btn_0">
         ${recipeName}
        </button>`);
          }
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

// Functions

// Event listeners
$("#search_button").on("click", function (e) {
  e.preventDefault();
  let meal = $("#recipe_input").val();
  console.log(meal);
  getRecipe(meal);
});
