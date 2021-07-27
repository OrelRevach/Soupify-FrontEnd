<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="8">
        <v-card class="elevation-12 d-flex flex-column">
          <v-toolbar class color="primary" dark flat>
            <v-toolbar-title class="d-block text-center text-uppercase">{{
              recipe.title
            }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text class="d-flex flex-column card">
            <transition name="fade" mode="out-in">
              <v-row v-if="loading">
                <v-col class="text-center">
                  <v-progress-circular
                    color="primary"
                    indeterminate
                  ></v-progress-circular>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col cols="4" class="position-relative">
                  <v-img class="elevation-2 mb-2" v-bind:src="recipe.image" />

                  <RecipeInfo
                    class="float-left"
                    hideWatched="true"
                    v-bind:recipe="recipe"
                  />

                  <RecipeRating
                    class="rating-container position-absolute"
                    style="right:0"
                    v-bind:rating="recipe.aggregate_likes"
                  />
                </v-col>
                <v-col cols="8">
                  <div class="position-relative fill-height">
                    <h3 class="mb-2">Ingredients</h3>
                    <ul id="ingredientList">
                      <li
                        :key="ingredient.id"
                        class="text--text"
                        v-for="ingredient in recipe.extended_ingredients"
                      >
                        <span class="ingredient-name">
                          {{ ingredient.name }}
                        </span>
                        (
                        <span
                          v-html="$options.filters.fraction(ingredient.amount)"
                        ></span>
                        <span v-if="ingredient.unit"
                          >&nbsp;{{ ingredient.unit }}</span
                        >)
                      </li>
                    </ul>
                    <h3 class="my-2">Instructions</h3>
                    <ol id="instructions">
                      <li
                        :key="instruction"
                        class="text--text"
                        v-for="instruction in recipe.instructions"
                      >
                        {{ instruction }}
                      </li>
                    </ol>
                    <v-tooltip bottom light>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          v-bind="attrs"
                          v-on="on"
                          @click="addToMeal"
                          class="position-absolute small white--text"
                          style="right:0; top: 0"
                          color="primary"
                          fab
                          outlined
                          small
                        >
                          <v-icon dark>mdi-silverware</v-icon>
                        </v-btn>
                      </template>
                      <span class="text--hint">
                        Cook this Meal
                      </span>
                    </v-tooltip>
                  </div>
                </v-col>
              </v-row>
            </transition>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import RecipeService from "@/services/recipes";
import RecipeInfo from "@/components/RecipeInfo.vue";
import RecipeRating from "@/components/RecipeRating.vue";

export default {
  name: "RecipePage",

  components: {
    RecipeInfo,
    RecipeRating
  },

  data: () => ({
    loading: true,
    recipe: {}
  }),

  mounted() {
    let recipeId = this.$route.params.id;
    let includeAdditionalData = this.$route.query.metadata;

    RecipeService.getRecipe(recipeId, includeAdditionalData).then(response => {
      this.recipe = response.data;
      this.loading = false;

      if (!response.watched) {
        this.recipe.watched = true;
        RecipeService.setWatched(recipeId).then();
      }
    });
  },
  methods: {
    async addToMeal() {
      let recipeId = this.$route.params.id;
      await RecipeService.addToMeal(recipeId).then();
      await this.$router.push("/recipe-cook/" + recipeId);
    }
  }
};
</script>

<style scoped>
.ingredient-name {
  text-transform: capitalize;
}

#instructions li {
  margin-bottom: 1em;
}
</style>
