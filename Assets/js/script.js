// FETCHING RECIPE API: Edamam
// Edamam Recipe Search API Documentation is viewable here: https://developer.edamam.com/edamam-docs-recipe-api
var app_id = "e32899ff";
var app_key = "23e6d6d3b09c69fc834e9c32abb3ca62";
var ourRecipesArray = []; // my array
var favRecipes = JSON.parse(localStorage.getItem("favRecipes")) || [];

// Last result index (exclusive, default from + 12). We use 12 becuase we want to show more results than 10
const getRecipes = function (url) {
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
        var result_count = data.hits.length;
        console.log("Total Results: " + result_count);
        $("#content_header").removeClass("hide");

        if (data.count === 0) {
          document.querySelector(".results_count").textContent =
            "No results found, try search again";
          document;
        } else {
          document.querySelector(".results_count").textContent =
            result_count + " results";

          // create an array of objects containing the data that we want
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
          // if there is less then 12 results
          if (ourRecipesArray.length < 12) {
            $("#recipe_options").removeClass("hide");
            $("#grocery_aside").removeClass("hide");

            // Setting the recipe name and src attribute of the recipe image
            var allRecipeCards = document.querySelectorAll("#recipe_card");
            var allRecipeNameEl = document.querySelectorAll("#recipe_name");
            var allRecipeImgEl = document.querySelectorAll("#recipe_img");
            var allRecipeSources = document.querySelectorAll("#source");
            var allRecipeButtons = document.querySelectorAll("#view_recipe");
            var allRecipeCaloriesEl = document.querySelectorAll("#calories");
            var allRecipeIngr = document.querySelectorAll("#ingredient_cnt");
            var allHealthLabels = document.querySelectorAll("#health_labels");

            for (var i = 0; i < ourRecipesArray.length; i++) {
              allRecipeCards[i].classList.remove("hide");
              allRecipeNameEl[i].textContent = ourRecipesArray[i].name;
              allRecipeImgEl[i].setAttribute("src", ourRecipesArray[i].image);
              allRecipeSources[i].textContent = ourRecipesArray[i].source;
              allRecipeButtons[i].href = ourRecipesArray[i].url;
              var calories = ourRecipesArray[i].calories;
              var servings = ourRecipesArray[i].yield;
              var cal_per_serv = parseInt(calories / servings);
              allRecipeCaloriesEl[i].textContent = cal_per_serv;
              allRecipeIngr[i].textContent =
                ourRecipesArray[i].ingredients.length;
              if (cal_per_serv <= 300) {
                allRecipeCaloriesEl[i].classList.add("low-marker");
              } else if (cal_per_serv <= 700) {
                allRecipeCaloriesEl[i].classList.add("med-marker");
              } else {
                allRecipeCaloriesEl[i].classList.add("high-marker");
              }
              if (ourRecipesArray[i].ingredients.length <= 5) {
                allRecipeIngr[i].classList.add("low-marker");
              } else if (ourRecipesArray[i].ingredients.length <= 15) {
                allRecipeIngr[i].classList.add("med-marker");
              } else {
                allRecipeIngr[i].classList.add("high-marker");
              }
            }
          } else {
            // We use "ourRecipesArray" to print the results to the screen
            printRecipeOptions(ourRecipesArray);
          }
        }
      })
      .catch(function (err) {
        console.error("Fetch Error: ", err);
      });
  });
};

// EVENT LISTENERS
$("#open_form_button").on("click", function () {
  $("#search_alert").text("");
  $("#searchForm").modal();
  $("#recipe_options").addClass("hide");
  $("#filter_input").addClass("hide");
  $("#filter_input").empty();
  $("#content_header").addClass("hide");
  var allRecipeCards = document.querySelectorAll("#recipe_card");
  for (var i = 0; i < allRecipeCards.length; i++) {
    allRecipeCards[i].classList.add("hide");
  }
});

$(".sidenav-trigger").on("click", function () {
  $(".sidenav").sidenav();
});

$("#search_button").on("click", function (e) {
  e.preventDefault();
  ourRecipesArray = [];
  $("#grocery_tohide").text("Press the red button to see ingredients!");
  let meal = $("#recipe_input").val().trim();
  let max_num_ingredients = $("#max_ingredients_input").val().trim();
  let min_calories = $("#min_calories").val().trim();
  let max_calories = $("#max_calories").val().trim();
  let allCheckedBoxes = $("input[type=checkbox]:checked");
  // confirm input is valid
  if (meal === "") {
    // if meal search input is left empty or calorie range input is invalid
    $("#search_alert").text("Please enter a recipe, ingredient, or keyword");
    return false;
  } else {
    $("#searchForm").modal("close");
    $("#content_header").removeClass("hide");
    let url =
      "https://api.edamam.com/search?q=" +
      meal +
      "&app_id=" +
      app_id +
      "&app_key=" +
      app_key +
      "&from=0&to=50";

    if (!(max_num_ingredients === "")) {
      url += "&ingr=" + max_num_ingredients;
      $("#filter_input").removeClass("hide");
      $("#filter_input").append(
        `<button>${max_num_ingredients} or less ingredients</button>`
      );
    }

    if (!(min_calories === "" && max_calories === "")) {
      $("#filter_input").removeClass("hide");
      if (!(min_calories === "") && max_calories === "") {
        // if only min calories is filled out
        url += "&calories=" + min_calories + "-";
        $("#filter_input").append(
          `<button>More than ${min_calories} calories/serving</button>`
        );
      } else if (!(max_calories === "") && min_calories === "") {
        // if only max calories is filled out
        url += "&calories=-" + max_calories;
        $("#filter_input").append(
          `<button>Less than ${max_calories} calories/serving</button>`
        );
      } else {
        url += "&calories=" + min_calories + "-" + max_calories;
        $("#filter_input").append(
          `<button>${min_calories}-${max_calories} calories/serving</button>`
        );
      }
    }
    // check if filters are added
    if (allCheckedBoxes.length) {
      $("#filter_input").removeClass("hide");
      for (var i = 0; i < allCheckedBoxes.length; i++) {
        var id = allCheckedBoxes[i].getAttribute("id");
        var apiParameter = allCheckedBoxes[i].getAttribute("apiParameter");
        if (id === "dietParameter") {
          url += "&diet=" + apiParameter;
        } else if (id === "healthParameter") {
          url += "&health=" + apiParameter;
        }
        $("#filter_input").append(`<button>${apiParameter}</button>`);
      }
    }
    // fetch recipes
    getRecipes(url);
    document.querySelector("#search_term").textContent = meal + " recipes";
    console.log("Fetching results with the url: " + url);
  }
});

$(":button").on("click", function (event) {
  event.preventDefault();
  $("#grocery_ul").empty();
  let currentId = $(this).attr("id");
  if (currentId === "ingredient_list") {
    let curRecipe = $(this).val();
    let curRecipeObj = ourRecipesArray[curRecipe];
    $("#grocery_tohide").text(curRecipeObj.name);
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
      let recipeName4 = document.createElement("h4");
      let recipeSource4 = document.createElement("p");
      let recipeSourceSpan = document.createElement("span");
      let recipeCalorieEl = document.createElement("p");
      let recipeCalorieSpan = document.createElement("span");
      let recipeIngrCountEl = document.createElement("p");
      let recipeIngrCountSpan = document.createElement("span");
      let recipeLink5 = document.createElement("a");

      favGrid1.setAttribute("class", "col s6 m3");
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
      recipeCalorieEl.textContent = "Calories: ";
      cardCon3.appendChild(recipeCalorieEl);
      recipeIngrCountEl.textContent = "Ingredients: ";
      cardCon3.appendChild(recipeIngrCountEl);
      cardCon3.appendChild(recipeLink5);
      recipeName4.setAttribute("id", "recipe_name_r");
      recipeSourceSpan.setAttribute("id", "source_r");
      recipeSource4.textContent = "Source: ";
      recipeSource4.appendChild(recipeSourceSpan);
      recipeCalorieSpan.setAttribute("id", "calories_r");
      recipeIngrCountSpan.setAttribute("id", "ingr_cnt_r");
      recipeIngrCountEl.appendChild(recipeIngrCountSpan);
      recipeCalorieEl.appendChild(recipeCalorieSpan);
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
    let allRecipeCalories_r = document.querySelectorAll("#calories_r");
    let allRecipeIngrCounts_r = document.querySelectorAll("#ingr_cnt_r");

    for (let i = 0; i < favRecipes.length; i++) {
      allRecipeNameEl_r[i].textContent = favRecipes[i].name;
      allRecipeImgEl_r[i].setAttribute("src", favRecipes[i].image);
      allRecipeSources_r[i].textContent = favRecipes[i].source;
      allRecipeButtons_r[i].setAttribute("href", favRecipes[i].url);
      var calories = favRecipes[i].calories;
      var servings = favRecipes[i].yield;
      var cal_per_serv = parseInt(calories / servings);
      allRecipeCalories_r[i].textContent = cal_per_serv;
      allRecipeIngrCounts_r[i].textContent = favRecipes[i].ingredients.length;
      if (cal_per_serv <= 300) {
        allRecipeCalories_r[i].classList.add("low-marker");
      } else if (cal_per_serv <= 700) {
        allRecipeCalories_r[i].classList.add("med-marker");
      } else {
        allRecipeCalories_r[i].classList.add("high-marker");
      }
      if (favRecipes[i].ingredients.length <= 5) {
        allRecipeIngrCounts_r[i].classList.add("low-marker");
      } else if (favRecipes[i].ingredients.length <= 15) {
        allRecipeIngrCounts_r[i].classList.add("med-marker");
      } else {
        allRecipeIngrCounts_r[i].classList.add("high-marker");
      }
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
  var allRecipeCards = document.querySelectorAll("#recipe_card");
  var allRecipeNameEl = document.querySelectorAll("#recipe_name");
  var allRecipeImgEl = document.querySelectorAll("#recipe_img");
  var allRecipeSources = document.querySelectorAll("#source");
  var allRecipeButtons = document.querySelectorAll("#view_recipe");
  var allRecipeCaloriesEl = document.querySelectorAll("#calories");
  var allRecipeIngr = document.querySelectorAll("#ingredient_cnt");

  for (var i = 0; i < allRecipeCards.length; i++) {
    allRecipeCards[i].classList.remove("hide");
    allRecipeNameEl[i].textContent = resultArray[i].name;
    allRecipeImgEl[i].setAttribute("src", resultArray[i].image);
    allRecipeSources[i].textContent = resultArray[i].source;
    allRecipeButtons[i].href = resultArray[i].url;
    var calories = resultArray[i].calories;
    var servings = resultArray[i].yield;
    var cal_per_serv = parseInt(calories / servings);
    allRecipeCaloriesEl[i].textContent = cal_per_serv;
    allRecipeIngr[i].textContent = resultArray[i].ingredients.length;
    if (cal_per_serv <= 300) {
      allRecipeCaloriesEl[i].classList.add("low-marker");
    } else if (cal_per_serv <= 700) {
      allRecipeCaloriesEl[i].classList.add("med-marker");
    } else {
      allRecipeCaloriesEl[i].classList.add("high-marker");
    }
    if (resultArray[i].ingredients.length <= 5) {
      allRecipeIngr[i].classList.add("low-marker");
    } else if (resultArray[i].ingredients.length <= 15) {
      allRecipeIngr[i].classList.add("med-marker");
    } else {
      allRecipeIngr[i].classList.add("high-marker");
    }
  }
}
