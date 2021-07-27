<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="8">
        <RecipeList
          hideWatchedIndicator="true"
          size="lg"
          title="Family Recipes"
          v-bind:dataSource="loadFamilyRecipes"
          lockHeight="true"
          includeAdditionalData="true"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import RecipeService from "@/services/recipes";
import RecipeList from "@/components/RecipeList.vue";

export default {
  name: "FamilyRecipes",

  components: {
    RecipeList
  },

  data: () => ({}),

  methods: {
    loadFamilyRecipes(page) {
      return RecipeService.getFamilyRecipes(page);
    }
  }
};
</script>
