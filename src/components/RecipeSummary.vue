<template>
  <v-row
    v-bind:class="'recipe-item position-relative px-4 ' + recipeClassSuffix"
  >
    <v-col class="d-flex">
      <div class="d-flex flex-column align-center">
        <v-img
          aspect-ratio="1.2"
          v-bind:class="imageClasses"
          v-bind:max-width="imageWidth"
          v-bind:src="recipe.image"
          v-bind:width="imageWidth"
        />
        <RecipeRating
          class="rating-container"
          v-bind:rating="recipe.aggregate_likes"
        />
      </div>
      <div
        v-bind:class="
          'fill-height flex-grow-1 ml-4 overflow-hidden ' +
            (size !== 'md' ? ' pad-score' : '')
        "
      >
        <!-- Details -->
        <h3 class="single-line mb-2" :class="size" v-if="!hideTitle">
          {{ recipe.title }}
        </h3>

        <RecipeInfo
          v-bind:hideWatched="hideWatchedIndicator"
          v-bind:recipe="recipe"
          v-bind:size="size"
        />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import RecipeInfo from "@/components/RecipeInfo.vue";
import RecipeRating from "@/components/RecipeRating.vue";

export default {
  name: "RecipeSummary",

  props: [
    "recipe",
    "size",
    "height",
    "hideWatchedIndicator", // In case all recipes already been seen and we want to hide the indicator
    "hideTitle",
    "disableAnimation" // Disables zoom and other animations for plain summary
  ],

  components: {
    RecipeInfo,
    RecipeRating
  },

  data: () => ({
    thumbSize: 3
  }),

  mounted() {
    switch (this.$props.size) {
      case "md":
        this.thumbSize = 3;
        break;

      case "lg":
        this.thumbSize = 4;
        break;
    }
  },

  computed: {
    imageClasses() {
      let className = "";
      if (this.$props.size === "md") className += " mb-2";
      return className;
    },

    imageWidth() {
      let width = 120;
      if (this.$props.size === "lg") width = 200;
      return width;
    },

    recipeClassSuffix() {
      return (
        this.$props.size +
        (this.$props.disableAnimation ? " disableAnimation" : "")
      );
    }
  }
};
</script>

<style scoped>
.recipe-item {
  transition: all 100ms ease-in-out;
}
.recipe-item:hover {
  background-color: rgba(185, 180, 180, 0.03);
}
.recipe-item:not(.disableAnimation):hover {
  transform: scale(1.01);
}

.pad-score {
  padding-right: 5.5em;
}

.lg .rating-container {
  position: absolute;
  top: 25px;
  right: 25px;
}

a:not(:first-child) .recipe-item {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}
</style>
