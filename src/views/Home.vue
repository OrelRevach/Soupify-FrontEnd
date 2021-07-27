<template>
  <v-container class="fill-height">
    <v-row class="fill-height">
      <v-col v-if="$vuetify.breakpoint.xlOnly" xl="2"></v-col>
      <v-col cols="8" xl="6">
        <RecipeList
          ref="randRecipes"
          size="lg"
          title="Explore these recipes"
          v-bind:dataSource="loadRandomRecipes"
          refreshButton="true"
          lockHeight="true"
        />
      </v-col>
      <v-col cols="4" xl="3">
        <LoginForm v-if="!isLoggedIn" />
        <RecipeList
          v-else
          size="md"
          title="Recently viewed"
          v-bind:dataSource="loadRecentRecipes"
          hideWatchedIndicator="true"
        />
      </v-col>
      <v-col v-if="$vuetify.breakpoint.xlOnly" xl="1"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import RecipeService from "@/services/recipes";
import RecipeList from "@/components/RecipeList.vue";
import LoginForm from "@/components/LoginForm.vue";

export default {
  name: "Home",

  components: {
    RecipeList,
    LoginForm
  },

  data: () => ({
    recentRecipes: [],
    randomRecipes: []
  }),

  methods: {
    loadRandomRecipes() {
      this.loadedWithToken = this.$store.getters.tokenPresent;
      return RecipeService.getRandomRecipes();
    },

    loadRecentRecipes() {
      return RecipeService.getRecentRecipes();
    }
  },

  computed: {
    isLoggedIn: function() {
      const currentVal = this.$store.getters.tokenPresent;
      // Reload random recipes if logged in after load, because current recipes are missing user data
      if (this.loadedWithToken === false && currentVal) {
        this.$refs.randRecipes.triggerLoad();
      }
      return currentVal;
    }
  }
};
</script>
