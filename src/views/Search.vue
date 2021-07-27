<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="8">
        <v-card class="elevation-12 d-flex flex-column">
          <v-toolbar class color="primary" dark flat>
            <v-toolbar-title class="d-block text-center text-uppercase"
              ><v-icon size="27" class="mr-2">mdi-magnify</v-icon
              >Search</v-toolbar-title
            >
          </v-toolbar>
          <v-card-text class="d-flex flex-column card">
            <v-row>
              <v-col cols="8">
                <v-text-field
                  v-model="query"
                  hide-details
                  placeholder="Type here to search"
                  light
                  :append-icon="
                    query ? 'mdi-square-edit-outline' : 'mdi-border-color'
                  "
                  v-bind:loading="searching"
                  v-on:keyup.enter="performSearch"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-btn
                  @click="performSearch"
                  class="search-button text--card"
                  color="success"
                  depressed
                  large
                  uppercase
                  >Search</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col v-for="filter in filters" v-bind:key="filter.name">
                <v-select
                  v-model="selectedFilters[filter.name]"
                  :label="'Filter ' + filter.name"
                  :items="filter.values"
                  :menu-props="{ light: true }"
                  persistent-hint
                  light
                  clearable
                  :append-icon="
                    filter.name === 'Cuisines'
                      ? 'mdi-google-maps'
                      : filter.name === 'Intolerances'
                      ? 'mdi-view-dashboard-outline'
                      : 'mdi-arm-flex-outline'
                  "
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <div class="offset-1">
                  <v-img
                    style="height: 100px;width: 100px"
                    src="https://res.cloudinary.com/serfati/image/upload/v1591970948/soupify_zrbnbo.png"
                  />
                </div>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="sort"
                  :label="'Sort by'"
                  :append-icon="
                    sort ? 'mdi-filter-outline' : 'mdi-filter-menu-outline'
                  "
                  :items="['none', 'aggregate_likes', 'ready_in_minutes']"
                  :menu-props="{ light: true }"
                  no-data-text="none"
                  outlined
                  hint="Pick your filter"
                  persistent-hint
                  light
                ></v-select>
              </v-col>
              <v-col cols="2">
                <v-select
                  v-model="limit"
                  :label="'Limit'"
                  outlined
                  :items="[5, 10, 15]"
                  :menu-props="{ light: true }"
                  persistent-hint
                  light
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center" v-show="!searching && resultsCount > 0">
      <v-col cols="8">
        <RecipeList
          ref="searchResults"
          size="lg"
          title="Results"
          v-on:loadFinish="searchComplete"
          v-bind:dataSource="searchRecipes"
          manual="true"
          lockHeight="true"
        />
      </v-col>
    </v-row>

    <v-row justify="center" v-if="!searching && resultsCount === 0">
      <v-col cols="8">
        <v-card class="elevation-12 d-flex flex-column">
          <v-card-text align="center" class="d-flex flex-column card">
            <h1 class="text--text py-5">No results found</h1>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import RecipeList from "@/components/RecipeList.vue";
import RecipeService from "@/services/recipes";
import filterData from "@/assets/filterData.json";
import localStorageFacade from "@/core/localStorageFacade";

export default {
  name: "Search",

  components: {
    RecipeList
  },

  data: () => ({
    searching: false,
    resultsCount: -1,
    query: "",
    sort: "",
    selectedFilters: {},
    filters: filterData,
    limit: 5
  }),

  mounted() {
    const savedSearch = this.$store.getters.savedSearch;
    if (savedSearch) {
      this.query = savedSearch.query;
      this.selectedFilters = savedSearch.selectedFilters || {};
      this.limit = savedSearch.limit;
      this.sort = savedSearch.sort;

      this.performSearch();
    }
  },

  methods: {
    searchRecipes(searchPage) {
      return RecipeService.searchRecipes(
        this.query,
        this.selectedFilters,
        searchPage,
        this.limit,
        this.sort
      );
    },

    performSearch() {
      this.searching = true;
      this.$refs.searchResults.triggerLoad();
    },

    searchComplete(resultsCount) {
      this.searching = false;
      this.resultsCount = resultsCount;
    }
  }
};
</script>

<style scoped>
.search-button {
  width: 100%;
  height: 100% !important;
}
</style>
