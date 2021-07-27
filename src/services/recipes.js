import httpClient from "@/services/httpClient";
import store from "@/store/index";

const ID_SOURCE_THRESHOLD = 200; // Threshold for determining if ID is local or belongs to the external API
const RECIPES_PER_PAGE = 3;
const SEARCH_RESULTS_LIMIT = 12;

export default {
  // GET /recipes/rand
  getRandomRecipes() {
    return this.getRecipesByRoute("/recipes/rand");
  },

  // GET /metadata/last-seen
  getRecentRecipes() {
    return new Promise((resolve, reject) => {
      httpClient
        .get("/metadata/last-seen")
        .then(response => {
          let results = response.data.results.filter(x => x !== null);
          // Adapt items
          results.forEach(res => {
            res.saved = res.favs;
            delete res.favs;
          });
          //
          resolve({ data: results });
        })
        .catch(reason => reject(reason));
    });
  },

  // GET /metadata/personal
  async getMyRecipes(requestedPage) {
    return await this.getMetaDataRecipes("personal", { page: requestedPage });
  },

  // GET /metadata/family
  async getFamilyRecipes(requestedPage) {
    return await this.getMetaDataRecipes(
      "family",
      { page: requestedPage },
      true
    );
  },

  // GET /metadata/favs
  async getFavoritesRecipes(requestedPage) {
    return await this.getMetaDataRecipes("favs", { page: requestedPage });
  },

  // GET /metadata/meal
  async getMealRecipes() {
    let recipes = await this.getMetaDataRecipes("meal");

    // Create string representation of accomodations
    recipes.data = recipes.data.map(recipe => {
      let accommodations = "";

      // Define helper function to append strings
      let appendTo = (str, value) => {
        if (str.length === 0) return value;
        else return str + ", " + value;
      };

      if (recipe.gluten_free)
        accommodations = appendTo(accommodations, "Gluten Free");

      // Since vegan is a subset of vegetarian we use else
      if (recipe.vegan) accommodations = appendTo(accommodations, "Vegan");
      else if (recipe.vegetarian)
        accommodations = appendTo(accommodations, "Vegetarian");

      recipe.accommodations =
        accommodations.length > 0 ? accommodations : "None";

      return recipe;
    });

    return recipes;
  },

  async getMetaDataRecipes(category, paginationConfig, extractAdditionalData) {
    try {
      let response = await httpClient.get("/metadata/" + category);
      let ids = response.data[category].filter(x => x !== null).reverse();
      const total = ids.length;
      let result = [];

      // Pagination
      let paginationData = {};
      if (paginationConfig !== undefined) {
        let pages = Math.ceil(ids.length / RECIPES_PER_PAGE);
        let page = paginationConfig.page || 1;
        let chunkStart = (page - 1) * RECIPES_PER_PAGE;
        ids = ids.slice(chunkStart, chunkStart + RECIPES_PER_PAGE);
        paginationData = { total_pages: pages, page: page, total: total, per_page: RECIPES_PER_PAGE };
      }

      // Get recipes by id
      const recipeResponses = ids.map(v =>
        this.getRecipe(v, extractAdditionalData)
      );

      // Adapt data
      for await (const response of recipeResponses) {
        let recipe = response.data;
        recipe.saved = true;
        delete recipe.favs;
        result.push(recipe);
      }

      return {
        data: result,
        Pagination: paginationData
      };
    } catch (e) {
      return { error: e };
    }
  },

  // GET /recipes/{id}
  async getRecipe(id, extractAdditionalData) {
    let route = "/recipes/" + id;
    if (id <= ID_SOURCE_THRESHOLD) route += "?local=true";

    let response = await this.getRecipesByRoute(route);

    if (extractAdditionalData) {
      // Extract data embedded in ingredients
      const additionalDataIndex = response.data.extended_ingredients.findIndex(
        x => !Object.prototype.hasOwnProperty.call(x, "id")
      ); // Additional data is the only item without id if it exists
      if (additionalDataIndex >= 0) {
        let extractedData = response.data.extended_ingredients.splice(
          additionalDataIndex,
          1
        )[0];
        response.data.additional_data = extractedData;
      }
    } else {
      // Remove data embedded in ingredients
      response.data.extended_ingredients = response.data.extended_ingredients.filter(
        x => Object.prototype.hasOwnProperty.call(x, "id")
      );
    }

    return response;
  },

  // POST /metadata/personal/{id}
  setPersonal(id) {
    return httpClient.post("/metadata/personal/" + id);
  },

  // POST /recipes
  async addRecipe(recipe) {
    const recipeWithId = await httpClient.post("/recipes/", recipe);
    console.log("recipe is:" + recipeWithId.data.id);
    await this.setPersonal(recipeWithId.data.id);
    return recipeWithId.data;
  },

  // POST /metadata/saved/{id}
  setSaved(id, value) {
    if (value) return httpClient.post("/metadata/favs/" + id);
    else return httpClient.delete("/metadata/favs/" + id);
  },

  // POST /metadata/watched/{id}
  setWatched(id) {
    return httpClient.post("/metadata/watched/" + id);
  },

  // POST /metadata/meal/{id}
  addToMeal(id) {
    return httpClient
      .post("/metadata/meal/" + id)
      .then(i => store.dispatch("updateMealCount", i.data.meal.length));
  },

  // DELETE /metadata/meal/{id}
  removeFromMeal(id) {
    return httpClient.delete("/metadata/meal/" + id).then(i => {
      store.dispatch("updateMealCount", i.data.meal.length);
      store.dispatch("removeRecipeFromMeal", id);
    });
  },

  // POST /metadata/mealOrder
  updateMealOrder(orderedIds) {
    return httpClient.post("/metadata/reorder/", orderedIds);
  },

  // GET /recipes/search
  searchRecipes(query, selectedFilters, requestedPage, number, sort) {
    // Save search to load later
    store.dispatch("saveSearch", {
      query: query,
      selectedFilters: selectedFilters,
      limit: number,
      sort: sort
    });

    return this.getRecipesByRoute("/recipes/search", {
      query: query,
      cuisine: selectedFilters.Cuisines,
      diet: selectedFilters.Diets,
      intolerances: selectedFilters.Intolerances,
      instructionsRequired: true,
      number: number ? number : SEARCH_RESULTS_LIMIT,
      limit: RECIPES_PER_PAGE,
      sort: sort ? sort : null,
      page: requestedPage ? requestedPage : 0
    });
  },

  // GET /ingredients/
  ingredientsData() {
    return new Promise((resolve, reject) => {
      httpClient
        .get("/ingredients")
        .then(response => {
          let data = response.data;
          resolve(data);
        })
        .catch(reason => reject(reason));
    });
  },

  // POST /ingredients/
  addIngredient() {
    return new Promise((resolve, reject) => {
      httpClient
        .post("/ingredients")
        .then(response => {
          let data = response.data;
          resolve(data);
        })
        .catch(reason => reject(reason));
    });
  },

  // Method for fetching recipes from a route and processing them
  getRecipesByRoute(route, queryParams) {
    return new Promise((resolve, reject) => {
      httpClient
        .get(route, {
          params: queryParams
        })
        .then(response => {
          let data = this.parseRecipeResponse(response);

          this.processRecipes(data)
            .then(fullData => {
              resolve(fullData);
            })
            .catch(reason => reject(reason));
        })
        .catch(reason => reject(reason));
    });
  },

  // Standardizes different recipe responses, i.e single, array, array with pagination
  // Returns: {
  //     data: {} / []
  //     Pagination: {} / undefined
  //}
  parseRecipeResponse(response) {
    let data = response.data;

    // We either get our data directly or it is under 'results'
    if (Object.prototype.hasOwnProperty.call(data, "results"))
      data = data.results;

    // Wraps data if needed
    if (Object.prototype.hasOwnProperty.call(data, "data")) return data;
    else return { data: data };
  },

  // Processes either a single recipe or a list
  // Formats instructions and fetches metadata
  // Returns filled object
  processRecipes(recipesObj) {
    // Adapt object(s)
    recipesObj = this.applyToRecipesInObj(recipesObj, this.formatInstructions);
    // Load metadata if logged in
    if (store.getters.tokenPresent) {
      return new Promise(resolve => {
        httpClient
          .get("/metadata")
          .then(response => {
            recipesObj = this.applyToRecipesInObj(
              recipesObj,
              this.attachMetadata,
              response.data
            );
            resolve(recipesObj);
          })
          .catch(() => resolve(recipesObj));
      });
    } else {
      return new Promise(resolve => {
        resolve(recipesObj);
      });
    }
  },

  // Template for applying a function to an object or array accordingly
  applyToRecipesInObj(recipesObj, applyFunction, extraData) {
    let result;
    let data = recipesObj.data;
    if (Array.isArray(data)) {
      // Update each recipe
      result = data.map(recipe => applyFunction(recipe, extraData));
    } else {
      // Update single recipe
      result = applyFunction(data, extraData);
    }
    recipesObj.data = result;
    return recipesObj;
  },

  // Updates recipe data based on the response of a metadata request
  attachMetadata(recipe, metadataResponse) {
    recipe.watched = metadataResponse.watched.includes(recipe.id);
    recipe.saved = metadataResponse.favs.includes(recipe.id);
    recipe.addedToMeal = metadataResponse.meal.includes(recipe.id);

    return recipe;
  },

  // Parses recipe instructions into an array
  formatInstructions(recipe) {
    recipe.instructions = recipe.instructions
      .replace(/^Instructions\s*/, "")
      .replace(/<.*?>/g, ".")
      .replace(/[.!]+/g, ".")
      .split(/\.\s*/)
      .filter(line => line.length > 2 && !line.match(/Step .*:/g))
      .map(line => line + ".");
    return recipe;
  }
};
String.prototype.replaceAt = function(index, replacement) {
  return (
    this.substr(0, index) +
    replacement +
    this.substr(index + replacement.length)
  );
};
