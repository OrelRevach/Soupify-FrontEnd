<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="8">
        <v-card class="elevation-12 d-flex flex-column">
          <v-toolbar class color="primary" dark flat>
            <v-toolbar-title class="d-block text-center text-uppercase">
              <v-icon large>mdi-pot</v-icon>
              {{ recipe.title }}
            </v-toolbar-title>
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
                <v-col cols="4">
                  <v-img class="elevation-2 mb-2" v-bind:src="recipe.image" />

                  <RecipeInfo
                    class="float-left"
                    hideWatched="true"
                    v-bind:recipe="recipe"
                  />

                  <RecipeRating
                    class="rating-container float-right"
                    v-bind:rating="recipe.aggregate_likes"
                  />
                  <div class="d-inline-flex ml-2 mt-8">
                    <v-btn
                      @click="multiply"
                      class="small white--text"
                      color="primary"
                      fab
                      outlined
                      x-small
                      title="Multiply Counts"
                    >
                      <v-icon dark>mdi-format-superscript</v-icon>
                    </v-btn>
                    <v-btn
                      @click="divide"
                      class="small ml-2 white--text"
                      color="primary"
                      outlined
                      fab
                      x-small
                      title="Divide Counts"
                    >
                      <v-icon dark>mdi-square-root</v-icon>
                    </v-btn>
                  </div>
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
                      <div
                        v-for="(instruction, index) in recipe.instructions"
                        :key="instruction"
                        class="text--text align-center d-flex"
                      >
                        <v-checkbox
                          v-model="completeInstructionsArray[index]"
                          @click.stop="updateProgress(index + 1)"
                          class="mr-5"
                          light
                          required
                        />
                        <li class="mt-3">{{ instruction }}</li>
                      </div>
                    </ol>
                  </div>
                </v-col>
                <v-progress-linear
                  style="max-width: 49em;"
                  class="ml-7 black--text font-weight-bold"
                  color="light-green darken-4"
                  :buffer-value="progress + 10"
                  :value="progress"
                  height="25"
                  striped
                  stream
                  >{{ Math.ceil(progress) || 0 }}%</v-progress-linear
                >
                <v-btn
                  to="/meal"
                  class="ma-3 small white--text"
                  color="success"
                  fab
                  outlined
                  small
                  title="Back To My Meal"
                >
                  <v-icon dark>mdi-keyboard-backspace</v-icon>
                </v-btn>
                <v-btn
                  to="/"
                  class="ma-3 small white--text"
                  color="success"
                  fab
                  outlined
                  small
                  title="Back Home"
                >
                  <v-icon dark>mdi-home</v-icon>
                </v-btn>
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
  name: "RecipeCook",

  components: {
    RecipeInfo,
    RecipeRating
  },

  data: () => ({
    loading: true,
    instructionProgress: -1,
    completeInstructionsArray: [],
    progress: 0,
    step: 0,
    recipe: {}
  }),

  mounted() {
    let recipeId = this.$route.params.id;

    RecipeService.getRecipe(recipeId).then(response => {
      this.recipe = response.data;
      this.step = 100 / this.recipe.instructions.length;
      this.loading = false;
      if (!response.watched) {
        this.recipe.watched = true;
        RecipeService.setWatched(recipeId).then();
      }
      // Load current progress
      this.updateProgressLocal(
        this.$store.getters.mealProgress[this.recipe.id]
      );
    });
  },
  methods: {
    multiply() {
      this.recipe.serving *= 2;
      this.recipe.extended_ingredients = this.recipe.extended_ingredients.map(
        i => {
          i.amount *= 2;
          return i;
        }
      );
    },
    divide() {
      this.recipe.serving /= 2;
      this.recipe.extended_ingredients = this.recipe.extended_ingredients.map(
        i => {
          i.amount /= 2;
          return i;
        }
      );
    },

    updateProgressLocal(val) {
      if (typeof val !== "number") val = 0;

      let totalInstructions = this.recipe.instructions.length;

      if (val <= this.instructionProgress) val -= 1; // In case user goes back - this unchecks current

      this.instructionProgress = val;

      // Creates a boolean array representing each instruction and if its complete
      this.completeInstructionsArray = [...Array(totalInstructions).keys()].map(
        i => i < this.instructionProgress
      );

      this.progress = Math.floor(
        (this.instructionProgress / totalInstructions) * 100
      );
    },

    updateProgress(val) {
      this.updateProgressLocal(val);

      // Save progress for recipe through Vuex store
      this.$store.dispatch("updateRecipeCookProgress", {
        recipeId: this.recipe.id,
        progress: this.instructionProgress
      });
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
