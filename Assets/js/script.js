// const getRecipe = function (meal) {
//   let apiUrl = "https://recipe-puppy.p.rapidapi.com/?q=" + meal;
//   let apiInfo = {
//     method: "GET",
//     headers: {
//       "x-rapidapi-key": "a1763f65f3mshc9f6db6be3a5287p184f59jsneb238681d7af",
//       "x-rapidapi-host": "recipe-puppy.p.rapidapi.com",
//     },
//   };
//   fetch(apiUrl, apiInfo)
//     .then(function (response) {
//       if (response.ok) {
//         response.json().then(function (data) {
//           console.log(data);
//   for (var i = 0; i < data.results.length; i++) {
//     var recipeName = data.results[i].title;
//     console.log(recipeName);
//     $("#options")
//       .append(`<button style=" width: 200px; height: 300px; padding: 10px; margin: 10px;" class="list-group-item text-left btn btn-outline-secondary" type="button" id="recipe_btn_0">
//  ${recipeName}
// </button>`);
//           }
//         });
//       } else {
//         alert("Error: " + response.statusText);
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// };

// FETCHING RECIPE API: Edamam
// Edamam Recipe Search API Documentation is viewable here: https://developer.edamam.com/edamam-docs-recipe-api
var app_id = "e32899ff";
var app_key = "23e6d6d3b09c69fc834e9c32abb3ca62";
// Last result index (exclusive, default from + 10). We use 20 becuase we want to show more results than 10
const getRecipe = function (meal) {
  let url =
    "https://api.edamam.com/search?q=" +
    meal +
    "&app_id=" +
    app_id +
    "&app_key=" +
    app_key +
    "&from=0&to=20";
  fetch(url).then(function (response) {
    if (!response.ok) {
      console.log("Looks like there was a problem. " + response.statusText);
      return;
    }
    // Examine the text in the response
    response
      .json()
      .then(function (data) {
        var results_count = data.count;

        $("#recipe_options").prepend(
          `<h2>${meal} recipes <span class="results_count">${results_count} results</span></h2>`
        );
        console.log("Total Results: " + data.count);
        console.log(data);

        // we will create an array of objects containing the data that we are interested in
        var ourRecipesArray = []; // my array
        var recipe = {}; // my object

        for (var i = 0; i < data.hits.length; i++) {
          recipe = {
            name: data.hits[i].recipe.label,
            image: data.hits[i].recipe.image,
            source: data.hits[i].recipe.source,
            url: data.hits[i].recipe.url,
            ingredients: data.hits[i].recipe.ingredients,
            calories: data.hits[i].recipe.calories,
            yield: data.hits[i].recipe.yield,
            cautions: data.hits[i].recipe.cautions,
            dietLabels: data.hits[i].recipe.dietLabels,
            healthLabels: data.hits[i].recipe.healthLabels,
            totalDaily: data.hits[i].recipe.dietLabels,
            totalNutrients: data.hits[i].recipe.totalNutrients,
          };
          ourRecipesArray.push(recipe);
        }

        console.log("This is our object we created that holds the recipes: ");
        console.log(ourRecipesArray);

        // We use "ourRecipesArray" to print the results to the screen
        printRecipeOptions(ourRecipesArray);
      })
      .catch(function (err) {
        console.error("Fetch Error: ", err);
      });
  });
};

// EVENT LISTENERS
$("#open_form_button").on("click", function () {
  $("#searchForm").modal();
});

$("#search_button").on("click", function (e) {
  e.preventDefault();
  let meal = $("#recipe_input").val().trim();
  if (meal === "") {
    alert("Please input a Value");
    return false;
  } else {
    $("#searchForm").modal("close");
    console.log("Fetching results with the term: " + meal);
    getRecipe(meal);
  }
});

// FUNCTIONS
// This function prints the recipe options to the screen in nicely formatted cards
function printRecipeOptions(resultArray) {
  // remove the class="hide" on the container with the id="recipe_options"
  $("#recipe_options").removeClass("hide");

  // Setting the recipe name and src attribute of the recipe image
  var allRecipeNameEl = document.querySelectorAll("#recipe_name");
  var allRecipeImgEl = document.querySelectorAll("#recipe_img");
  var allRecipeSources = document.querySelectorAll("#source");
  var allRecipeButtons = document.querySelectorAll("#view_recipe");

  for (var i = 0; i < allRecipeNameEl.length; i++) {
    allRecipeNameEl[i].textContent = resultArray[i].name;
    allRecipeImgEl[i].setAttribute("src", resultArray[i].image);
    allRecipeSources[i].textContent = "Source: " + resultArray[i].source;
    allRecipeButtons[i].setAttribute("href", resultArray[i].url);
  }
}
