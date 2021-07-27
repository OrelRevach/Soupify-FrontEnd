<template>
  <v-card class="elevation-12 d-flex flex-column">
    <v-toolbar class color="primary" dark flat>
      <v-toolbar-title class="d-block text-center text-uppercase">
        <v-icon size="27" class="mr-1 mb-1">mdi-format-list-bulleted</v-icon>
        {{ title }}
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text class="d-flex flex-column card px-0">
      <h2 class="text-center my-2" v-if="recipeList.length === 0 && !loading">None</h2>
      <transition-group
        class="overflow-hidden"
        name="staggered-fade"
        ref="itemsContainer"
        tag="div"
        v-bind:css="false"
        v-on:before-enter="beforeEnter"
        v-on:enter="enter"
        v-on:leave="leave"
      >
        <router-link
          class="d-block"
          style="overflow: hidden"
          v-bind:data-index="index"
          v-bind:key="recipe.index"
          v-bind:to="{
            path:
              '/recipe/' +
              recipe.id +
              (includeAdditionalData ? '?metadata=true' : '')
          }"
          v-for="(recipe, index) in recipeList"
        >
          <RecipeSummary
            class="flex-grow-1"
            v-bind:height="itemHeight"
            v-bind:hideWatchedIndicator="hideWatchedIndicator"
            v-bind:recipe="recipe"
            v-bind:size="size"
          />
        </router-link>
      </transition-group>

      <div class="text-center" v-if="totalPages > 1">
        <v-pagination :length="totalPages" @input="onPageChange" light v-model="currentPage"></v-pagination>
      </div>
    </v-card-text>
    <v-card-actions class="d-flex flex-column card" v-if="refreshButton || loading">
      <v-btn
        :loading="loading"
        :text="loading"
        @click="triggerLoad"
        class="mb-4 px-12"
        color="primary"
      >Refresh recipes</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import RecipeSummary from "@/components/RecipeSummary.vue";
import Velocity from "velocity-animate";

export default {
  name: "RecipeList",
  props: [
    "dataSource", // Function returning a promise for an array
    "title", //
    "size",
    "refreshButton",
    "lockHeight", // Lock height after initial load, disables height changing on data reload
    "manual", // Disables automatic data loading from data source
    "hideWatchedIndicator", // In case all recipes already been seen and we want to hide the indicator
    "includeAdditionalData" // Do our items have additional data to display
  ],

  components: {
    RecipeSummary
  },

  data: () => ({
    loading: true,
    recipeList: [],
    totalPages: 1,
    currentPage: 1,
    previousPage: 1,
    currentIndex: 0,
    appendPos: "bottom"
  }),

  mounted() {
    if (!this.manual) this.triggerLoad();
  },

  methods: {
    // Used to load data from data source
    triggerLoad() {
      this.loading = true;

      if (this.$props.lockHeight) {
        const el = this.$refs.itemsContainer.$el;
        if (el.offsetHeight > 100)
          // 100 is an arbitrary threshold for determining a populated list
          el.setAttribute("style", `height: ${el.offsetHeight}px`);
      }

      const _self = this;
      this.dataSource(this.currentPage).then(response => {
        // Set indexes for determining order
        response.data.forEach(recipe => (recipe.index = this.currentIndex++)); // Assign indexes

        // Update page data from response
        if (Object.prototype.hasOwnProperty.call(response, "Pagination")) {
          this.currentPage = response.Pagination.page;
          this.totalPages = response.Pagination.total_pages;
        }

        // Update recipe list
        this.recipeList = response.data;

        // Update state
        this.loading = false;
        this.$emit("loadFinish", response.data.length);
      });
    },

    onPageChange() {
      this.previousPage = this.currentPage;
      this.triggerLoad(); // Reload data with updated page
    },

    // These functions replace css animation for the list transition using Velocity.js
    // Seen here: https://vuejs.org/v2/guide/transitions.html#Staggering-List-Transitions
    beforeEnter: function(el) {
      el.style.opacity = 0;
      el.style.height = 0;
    },
    enter: function(el, done) {
      let delay = el.dataset.index * 150;
      setTimeout(function() {
        Velocity(
          el,
          {
            opacity: 1,
            height: el.getElementsByClassName("recipe-item")[0].offsetHeight
          },
          { complete: done }
        );
      }, delay);
    },
    leave: function(el, done) {
      var delay = el.dataset.index * 150;
      setTimeout(function() {
        Velocity(el, { opacity: 0, height: 0 }, { complete: done });
      }, delay);
    }
  },

  computed: {
    itemHeight() {
      let itemHeight = "8em";
      switch (this.$props.size) {
        case "lg":
          itemHeight = "16em";
      }
      return itemHeight;
    }
  }
};
</script>
<style scoped>
header {
  flex-grow: 0;
}
</style>
