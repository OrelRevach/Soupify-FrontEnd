<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="8">
        <RecipeList
          hideWatchedIndicator="true"
          size="lg"
          title="Favorites Recipes"
          v-bind:dataSource="loadFavoritesRecipes"
          lockHeight="true"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import RecipeService from "@/services/recipes";
import RecipeList from "@/components/RecipeList.vue";

export default {
  name: "FavoritesRecipes",

  components: {
    RecipeList
  },

  data: () => ({}),

  methods: {
    loadFavoritesRecipes(page) {
      return RecipeService.getFavoritesRecipes(page);
    }
  },

  computed: {}
};
</script>
