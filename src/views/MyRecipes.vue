<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="8">
        <RecipeList
          hideWatchedIndicator="true"
          size="lg"
          title="My Recipes"
          v-bind:dataSource="loadMyRecipes"
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
  name: "MyRecipes",

  components: {
    RecipeList
  },

  data: () => ({}),

  methods: {
    loadMyRecipes(page) {
      return RecipeService.getMyRecipes(page);
    }
  }
};
</script>
