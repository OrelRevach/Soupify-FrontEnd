<template>
  <div class="mt-1">
    <!-- Ready in -->
    <v-icon class="mr-1" color="text" style="top: -1.5px" v-bind:size="iconSize"
      >mdi-alarm</v-icon
    >
    <span v-bind:class="size">
      {{ recipe["ready_in_minutes"] | timeString }}
    </span>
    <br />
    <!-- Serves -->
    <v-icon class="mr-1" color="text" style="top: -1.5px" v-bind:size="iconSize"
      >mdi-bowl</v-icon
    >
    <span v-bind:class="size">{{ recipe["serving"] }} servings</span>
    <br />

    <!-- Icons -->
    <div class="mt-1" style="left: -3px; position: relative;">
      <!-- Gluten -->
      <v-tooltip bottom light>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            class="mr-1"
            v-bind="attrs"
            v-on="on"
            v-bind:color="
              recipe['gluten_free'] ? 'noRestriction' : 'hasRestriction'
            "
            v-bind:size="iconSize"
            >mdi-barley</v-icon
          >
        </template>
        <span class="text--hint">{{
          recipe["gluten_free"] ? "Gluten free" : "Contains gluten"
        }}</span>
      </v-tooltip>

      <!-- Vegan / Vegeterian -->
      <v-tooltip bottom light>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            class="mr-1"
            v-bind="attrs"
            v-on="on"
            v-bind:color="
              recipe.vegan
                ? 'noRestriction'
                : recipe.vegetarian
                ? 'partialRestriction'
                : 'hasRestriction'
            "
            v-bind:size="iconSize"
            >mdi-leaf</v-icon
          >
        </template>
        <span class="text--hint">
          {{
            recipe.vegan
              ? "Vegan"
              : recipe.vegetarian
              ? "Vegetarian"
              : "Contains meat"
          }}
        </span>
      </v-tooltip>

      <!-- Watched -->
      <v-tooltip bottom light>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            class="mr-1"
            v-bind="attrs"
            v-on="on"
            v-bind:color="recipe.watched ? 'primary' : 'inactive'"
            v-bind:size="iconSize"
            v-if="isLoggedIn && !hideWatched"
            >mdi-eye</v-icon
          >
        </template>
        <span class="text--hint">
          {{ recipe.watched ? "Seen" : "Not seen" }}
        </span>
      </v-tooltip>

      <!-- Save -->
      <v-tooltip bottom light>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            class="save-icon mr-1"
            v-bind="attrs"
            v-on="on"
            v-bind:color="recipe.saved ? 'saved' : 'inactive'"
            v-bind:size="iconSize"
            v-if="isLoggedIn"
            v-on:click.stop.prevent="toggleSave()"
            >mdi-heart</v-icon
          >
        </template>
        <span class="text--hint">
          {{ recipe.saved ? "Saved" : "Not saved" }}
        </span>
      </v-tooltip>
    </div>

    <!-- Additional info -->
    <div v-if="recipe.additional_data">
      <p class="pt-2">
        <span
          v-for="(value, key) in recipe.additional_data"
          v-bind:key="key"
          class="d-block font-italic"
          style="font-size: 13px"
        >
          <v-icon v-if="key === 'source'" color="deep-purple" small right
            >mdi-chef-hat
          </v-icon>
          <v-icon v-else small color="deep-purple" right>
            mdi-calendar-clock
          </v-icon>
          {{ value }}
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import RecipeService from "@/services/recipes";

export default {
  name: "RecipeInfo",

  data: () => ({
    additionalInfoLocalizer: {
      source: "Recipe source",
      period: "Prepared around"
    }
  }),

  props: ["recipe", "size", "hideWatched"],

  methods: {
    toggleSave() {
      const recipe = this.$props.recipe;
      // Change value
      const original = recipe.saved;
      recipe.saved = !original;
      // Update server
      RecipeService.setSaved(recipe.id, recipe.saved)
        .then(res => (recipe.saved = res.data.favs.includes(recipe.id))) // Validate with result
        .catch(err => {
          console.log(err);
          recipe.saved = original;
        });
    }
  },

  computed: {
    isLoggedIn: function() {
      return this.$store.getters.tokenPresent;
    },

    iconSize: function() {
      switch (this.$props.size) {
        case "md":
          return 18;
        default:
        case "lg":
          return 28;
      }
    }
  }
};
</script>

<style scoped>
span {
  color: var(--v-text-base) !important;
  font-size: 1.2em;
}

span.lg {
  position: relative;
  top: 1px;
}

span.md {
  font-size: 1em;
}

.save-icon:hover {
  color: var(--v-saved-lighten3) !important;
}

.save-icon.saved--text:hover {
  color: var(--v-saved-base) !important;
}

.save-icon::after {
  display: none;
}
</style>
