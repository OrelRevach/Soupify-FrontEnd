import localStorageFacade from "@/core/localStorageFacade";

export default {
  state: {
    mealCount: "",
    mealProgress: localStorageFacade.getObject("mealProgress", {})
  },
  mutations: {
    recipe_progress(state, { recipeId, progress }) {
      state.mealProgress[recipeId] = progress;
    },
    remove_recipe_progress(state, { recipeId }) {
      delete state.mealProgress[recipeId];
    },
    update_meal_count(state, { count }) {
      state.mealCount = count;
    }
  },
  actions: {
    updateRecipeCookProgress({ commit }, { recipeId, progress }) {
      return new Promise(resolve => {
        commit("recipe_progress", { recipeId, progress });

        localStorageFacade.updateObjectProperty(
          "mealProgress",
          recipeId,
          progress
        );
        resolve();
      });
    },

    removeRecipeFromMeal({ commit }, recipeId) {
      return new Promise(resolve => {
        commit("remove_recipe_progress", { recipeId });

        localStorageFacade.removeObjectProperty("mealProgress", recipeId);
        resolve();
      });
    },

    updateMealCount({ commit }, newCount) {
      commit("update_meal_count", { count: newCount });
    }
  },
  getters: {
    mealCount: state => state.mealCount,
    mealProgress: state => state.mealProgress
  }
};
