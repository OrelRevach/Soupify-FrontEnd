#!/bin/bash

python scraper/country_scraper.py https://restcountries.eu/rest/v2/all ./src/assets/countryData.json
python scraper/food_scraper.py https://spoonacular.com/food-api/docs ./src/assets/filterData.json Cuisines Diets Intolerances