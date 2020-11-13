# Recipe Pal

## About The Repository

### Summary

This repository contains a food application call Recipe Pal, which is powered by Javascript, Materialize, jQuery, and Google Fonts. This application utilizes two APIs:

1. https://developer.edamam.com/edamam-docs-recipe-api
2. https://developers.google.com/places/web-service/search

The first API is used to obtain recipe information based off the user's search criteria. This information is then displayed. A recipe can be viewed on the source website by clicking the "view recipe" button and a grocery list can be compiled for the user by clicking the red button. Each time the user clicks the red button the selected recipe is store in localStorage as a "recent recipe". These recipes are displayed on the "Recent Recipes" page so the user can easily find recipes they used in the past.

The second API utilizes the user's location, if the user allows it, to find all grocery store locations within a 5K meter radius. The webpage will then display a list of all open grocery stores in the area. In addition, Recipe Pal utilizes these technologies to:

- Display the current weather in the user's chosen city.
- Display the 5 day forecast for that city.
- Save the search history in localStorage.
- Display an icon to show what the weather will be like.
- Display a color that indicates whether the UV index is favorable (green), moderate (yellow), or severe (red).

### Functionality

The application defaults to the last searched city on default based off what was saved to local storage. Once a new city is searched then that city's current weather and forecasted weather will be displayed. That city will also be saved to localStorage and the buttons will update to show the 8 most recent searched cities. If there isn't anything saved in localStorage then the application will default to the "startCities" array. When a button of the previously searched cities is clicked the weather will be updated for that city but the search history buttons will not but updated.

## Website Mock

Website URL: https://kaylamuraoka.github.io/Food_Application/

### Weather Application:

Start:
![Image of Start](./Assets/WA_Start_Page.PNG)

New City Searched:
![Image of New City](./Assets/WA_Update.PNG)
