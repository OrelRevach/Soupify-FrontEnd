<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="8">
        <v-card class="card">
          <v-toolbar color="primary" class="mb-5">
            <v-icon size="27" class="ma-3 mb-4"
              >mdi-silverware-fork-knife</v-icon
            >
            <v-toolbar-title
              class="ml-2 font-weight-bold d-block text-center text-uppercase"
              >Cook A Meal</v-toolbar-title
            >
          </v-toolbar>
          <v-data-table
            v-if="!loading"
            class="elevation-5 ma-3"
            :headers="dataTable.headers"
            :items="recipes"
            :single-expand="dataTable.singleExpand"
            :expanded.sync="dataTable.expanded"
            item-key="id"
            :show-expand="!reorderActive"
            light
            :footer-props="{
              light: true,
              prevIcon: 'mdi-minus',
              nextIcon: 'mdi-plus',
              'items-per-page-options': [5, 10, 15, 30]
            }"
            :items-per-page="5"
          >
            <template v-slot:item.ready_in_minutes="{ item }">
              <v-chip :color="getColor(item.ready_in_minutes)"
                >{{ item.ready_in_minutes }}
                <v-icon class="" x-small right
                  >mdi-clock-time-eight-outline</v-icon
                >
              </v-chip>
            </template>
            <template v-slot:item.serving="{ item }">
              <v-chip color="grey" outlined
                >{{ item.serving }}
                <v-icon x-small right color="grey"
                  >mdi-silverware-variant</v-icon
                >
              </v-chip>
            </template>
            <template v-slot:item.index="{ item }">
              <span v-if="!reorderActive">
                {{ recipes.indexOf(item) + 1 }}
              </span>
              <v-icon v-else x-small style="cursor: move"
                >mdi-drag-vertical</v-icon
              >
            </template>
            <template v-slot:expanded-item="{ headers, item }">
              <td
                :colspan="headers.length"
                class="text-center"
                style="color: darkslategray;"
              >
                <router-link :to="'/recipe-cook/' + item.id">
                  <RecipeSummary
                    class="white--text"
                    style
                    :recipe="item"
                    size="md"
                    :height="height"
                    hideTitle="true"
                    disableAnimation="true"
                    :hideWatchedIndicator="hideWatchedIndicator"
                  />
                </router-link>
              </td>
            </template>
            <template v-slot:item.progress="{ item }">
              <v-progress-linear
                v-model="item.progress"
                color="primary"
              ></v-progress-linear>
            </template>
            <template v-slot:item.action="{ item }">
              <v-tooltip bottom light>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    v-on="on"
                    small
                    @click="deleteItem(item)"
                    >mdi-delete</v-icon
                  >
                </template>
                <span class="text--hint">
                  Delete
                </span>
              </v-tooltip>
            </template>
          </v-data-table>
          <div class>
            <br />
            <v-progress-linear
              style="max-width: 44em; border-style: solid; border-radius: 100vh; border-width: 1px; border-color: lavender"
              class="ml-7 black--text font-weight-bold"
              color="light-green darken-4"
              rounded
              :buffer-value="100"
              :value="progress"
              v-if="recipes.length > 0"
              height="25"
              >{{ Math.ceil(progress) || 0 }}%</v-progress-linear
            >
            <br />
          </div>
          <v-btn
            to="/"
            class="ma-3 small white--text"
            color="success"
            fab
            outlined
            small
            title="Back Home"
          >
            <v-icon dark>mdi-keyboard-backspace</v-icon>
          </v-btn>
          <v-btn
            @click="clearAll"
            class="ml-3 small white--text"
            color="success"
            fab
            outlined
            small
            title="Clear All"
            v-if="recipes.length > 0"
          >
            <v-icon dark>mdi-delete-empty</v-icon>
          </v-btn>
          <v-btn
            @click="toggleReorder"
            class="ml-3 small white--text"
            color="success"
            fab
            :outlined="!reorderActive"
            small
            title="Reorder"
            v-if="recipes.length > 0"
          >
            <v-icon dark>mdi-swap-vertical</v-icon>
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import RecipeService from "@/services/recipes";
import RecipeSummary from "../components/RecipeSummary";
import Sortable from "sortablejs";

export default {
  components: {
    RecipeSummary
  },

  data: () => ({
    loading: true,
    reorderActive: false,
    progress: 0,
    recipes: [],
    height: "1em",
    hideWatchedIndicator: true,
    dataTable: {
      headers: [
        { text: "#", value: "index", sortable: false },
        {
          text: "Dish",
          align: "start",
          sortable: false,
          value: "title"
        },
        { text: "Preparation time (min)", value: "ready_in_minutes" },
        { text: "Servings", value: "serving" },
        { text: "Dietary accommodations", value: "accommodations" },
        { text: "Progress", value: "progress" },
        { text: "Action", value: "action" },
        { text: "", value: "data-table-expand" }
      ],
      expanded: [],
      singleExpand: true
    }
  }),

  async mounted() {
    this.recipes = (await RecipeService.getMealRecipes()).data.reverse();

    // Calculate progress for recipes
    const recipeProgressData = this.$store.getters.mealProgress;

    this.recipes.forEach(
      recipe =>
        (recipe.progress =
          Math.floor(
            (recipeProgressData[recipe.id] / recipe.instructions.length) * 100
          ) || 0)
    );

    this.updateProgress();

    // Bootstrap recipe sorting
    setTimeout(() => {
      let table = document.querySelector(".v-data-table tbody");
      const _self = this;
      this.sortableInstance = Sortable.create(table, {
        disabled: true,
        onEnd({ newIndex, oldIndex }) {
          // Move relevant item
          const rowSelected = _self.recipes.splice(oldIndex, 1)[0];
          _self.recipes.splice(newIndex, 0, rowSelected);
          // Update server
          RecipeService.updateMealOrder(_self.recipes.map(r => r.id));
        }
      });
    }, 0);

    this.loading = false;
  },

  methods: {
    async clearAll() {
      await this.$store.dispatch("updateMealCount", 0);
      let pro = [];
      for await (let i of this.recipes) {
        const p = await RecipeService.removeFromMeal(i.id);
        pro.push(p);
      }
      await Promise.all(pro);
      this.recipes = [];
      this.progress = 0;
    },

    async deleteItem(item) {
      if (confirm("Are you sure you want to delete this item?")) {
        const index = item.id;
        await RecipeService.removeFromMeal(index);
        this.recipes.splice(this.recipes.indexOf(item), 1);

        this.updateProgress();
      }
    },

    // updateCookedValue(item) {
    //   this.$store.dispatch("setCookedStatus", {
    //     recipeId: item.id,
    //     cooked: item.cooked
    //   });

    //   this.updateProgress();
    // },

    getColor(rim) {
      if (rim > 45) return "red";
      else if (rim > 30) return "orange";
      else return "green";
    },

    updateProgress() {
      // Sum ready_in_minutes for all recipes to calculate weights for each recipe
      const totalMealPrep = this.recipes.reduce(function(accumulator, recipe) {
        return accumulator + recipe.ready_in_minutes;
      }, 0);

      // Calculate weighted average of recipe progress
      this.progress = this.recipes.reduce((accumulator, recipe) => {
        const weight = recipe.ready_in_minutes / totalMealPrep;
        return accumulator + recipe.progress * weight;
      }, 0);
    },

    toggleReorder() {
      // Disable expanded rows to avoid bugs with reordering
      this.dataTable.expanded = [];
      this.reorderActive = !this.reorderActive;
      // Toggle sorting
      this.sortableInstance.option("disabled", !this.reorderActive);
    }
  }
};
</script>

<style scoped></style>
