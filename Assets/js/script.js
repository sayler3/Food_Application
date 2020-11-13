// FETCHING RECIPE API: Edamam
// Edamam Recipe Search API Documentation is viewable here: https://developer.edamam.com/edamam-docs-recipe-api
var app_id = "e32899ff";
var app_key = "23e6d6d3b09c69fc834e9c32abb3ca62";
var ourRecipesArray = []; // my array
var favRecipes = JSON.parse(localStorage.getItem("favRecipes")) || [];

// Last result index (exclusive, default from + 12). We use 12 becuase we want to show more results than 10
const getRecipes = function (meal, url) {
  fetch(url).then(function (response) {
    if (!response.ok) {
      console.log("Looks like there was a problem. " + response.statusText);
      return;
    }
    // Examine the text in the response
    response
      .json()
      .then(function (data) {
        console.log(data);
        document.querySelector("#search_term").textContent = meal + " recipes";
        document.querySelector(".results_count").textContent =
          data.count + " results";
        console.log("Total Results: " + data.count);

        // we will create an array of objects containing the data that we are interested in
        // var ourRecipesArray = []; // my array
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
  $("#recipe_options").addClass("hide");
});

$(".sidenav-trigger").on("click", function () {
  $(".sidenav").sidenav();
});

$("#search_button").on("click", function (e) {
  e.preventDefault();
  ourRecipesArray = [];
  let meal = $("#recipe_input").val().trim();
  if (meal === "") {
    alert("Please input a Value");
    return false;
  } else {
    $("#searchForm").modal("close");
    let url =
      "https://api.edamam.com/search?q=" +
      meal +
      "&app_id=" +
      app_id +
      "&app_key=" +
      app_key +
      "&from=0&to=12";

    // check if filters are added
    var allCheckedBoxes = $("input[type=checkbox]:checked");
    if (allCheckedBoxes.length) {
      for (var i = 0; i < allCheckedBoxes.length; i++) {
        var id = allCheckedBoxes[i].getAttribute("id");
        var apiParameter = allCheckedBoxes[i].getAttribute("apiParameter");
        url += "&health=" + apiParameter;
      }
    }
    // fetch recipes
    getRecipes(meal, url);
    console.log("Fetching results with the url: " + url);
  }
});

$(":button").on("click", function (event) {
  event.preventDefault();
  $("#grocery_ul").empty();
  let currentId = $(this).attr("id");
  if (currentId === "ingredient_list") {
    $("#grocery_tohide").empty();
    let curRecipe = $(this).val();
    let curRecipeObj = ourRecipesArray[curRecipe];
    favRecipes.splice(0, 0, curRecipeObj);
    localStorage.setItem("favRecipes", JSON.stringify(favRecipes));
    for (let i = 0; i < curRecipeObj.ingredients.length; i++) {
      let grocery_li = document.createElement("li");
      grocery_li.setAttribute("class", "collection-item");
      $("#grocery_ul").append(grocery_li);
      grocery_li.textContent = curRecipeObj.ingredients[i].text;
    }
    updateFavRecipe(favRecipes);
  } else {
  }
});

// This is to add recipe cards for favorite recipes that are stored in localStorage.
$("#fav_recipe_cards").ready(function () {
  // Check if there is anything in localStorage.
  if (favRecipes.length > 0) {
    // Setting attributes and appending
    for (let i = 0; i < favRecipes.length; i++) {
      // Elements that need to be created
      let favGrid1 = document.createElement("div");
      let card2 = document.createElement("div");
      let cardImg3 = document.createElement("div");
      let favRecipeImg4 = document.createElement("img");
      let cardCon3 = document.createElement("div");
      let recipeName4 = document.createElement("h5");
      let recipeSource4 = document.createElement("p");
      let recipeBut4 = document.createElement("button");
      let recipeLink5 = document.createElement("a");

      favGrid1.setAttribute("class", "col s6 m4 l4");
      favGrid1.appendChild(card2);
      card2.setAttribute("class", "card hoverable");
      card2.appendChild(cardImg3);
      card2.appendChild(cardCon3);
      cardImg3.setAttribute("class", "card-image");
      cardImg3.appendChild(favRecipeImg4);
      favRecipeImg4.setAttribute("id", "recipe_img_r");
      cardCon3.setAttribute("class", "card-content");
      cardCon3.appendChild(recipeName4);
      cardCon3.appendChild(recipeSource4);
      cardCon3.appendChild(recipeBut4);
      recipeName4.setAttribute("id", "recipe_name_r");
      recipeSource4.setAttribute("id", "source_r");
      recipeBut4.appendChild(recipeLink5);
      recipeLink5.setAttribute("id", "view_recipe_r");
      recipeLink5.setAttribute("target", "_blank");
      recipeLink5.textContent = "View Recipe";

      // Appending to HTML file
      $("#fav_recipe_cards").append(favGrid1);
    }
    // Variables to set textContent
    let allRecipeNameEl_r = document.querySelectorAll("#recipe_name_r");
    let allRecipeImgEl_r = document.querySelectorAll("#recipe_img_r");
    let allRecipeSources_r = document.querySelectorAll("#source_r");
    let allRecipeButtons_r = document.querySelectorAll("#view_recipe_r");

    for (let i = 0; i < favRecipes.length; i++) {
      allRecipeNameEl_r[i].textContent = favRecipes[i].name;
      allRecipeImgEl_r[i].setAttribute("src", favRecipes[i].image);
      allRecipeSources_r[i].textContent = "Source: " + favRecipes[i].source;
      allRecipeButtons_r[i].setAttribute("href", favRecipes[i].url);
    }

    allRecipeNameEl_r[0].textContent = favRecipes[0].name;
  } else {
    $("#rec_recipes").empty();
    $("#rec_recipes").append(
      "Unfortunately there are no recent recipes to show."
    );
  }
});

// FUNCTIONS
// This function prints the recipe options to the screen in nicely formatted cards
function printRecipeOptions(resultArray) {
  // remove the class="hide" on the container with the id="recipe_options"
  $("#recipe_options").removeClass("hide");
  $("#grocery_aside").removeClass("hide");

  // Setting the recipe name and src attribute of the recipe image
  var allRecipeNameEl = document.querySelectorAll("#recipe_name");
  var allRecipeImgEl = document.querySelectorAll("#recipe_img");
  var allRecipeSources = document.querySelectorAll("#source");
  var allRecipeButtons = document.querySelectorAll("#view_recipe");
  var allRecipeIngrBut = document.querySelectorAll("#ingredient_list");

  for (var i = 0; i < allRecipeNameEl.length; i++) {
    allRecipeNameEl[i].textContent = resultArray[i].name;
    allRecipeImgEl[i].setAttribute("src", resultArray[i].image);
    allRecipeSources[i].textContent = "Source: " + resultArray[i].source;
    allRecipeButtons[i].setAttribute("href", resultArray[i].url);
  }
}
