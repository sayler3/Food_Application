var api_key = "a8f7968642917eada65916047ac3150460c0056a";
fetch(
  "https://api.spoonacular.com/food/ingredients/search?apiKey=" +
    api_key +
    "&includeNutrition=true"
)
  .then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  })
  .catch((err) => {
    console.error(err);
  });
