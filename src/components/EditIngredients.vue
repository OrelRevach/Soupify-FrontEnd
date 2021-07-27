<template>
  <v-data-table
    :headers="headers"
    :items="value"
    disable-pagination
    light
    sort-by="name"
  >
    <template v-slot:top>
      <v-toolbar color="white" flat>
        <v-toolbar-title>Ingredients</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-dialog light max-width="500px" v-model="dialog">
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="mb-2" color="primary" dark v-bind="attrs" v-on="on"
              >Add</v-btn
            >
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <v-combobox
                      :items="availableIngredients"
                      :rules="[v => !!v || 'Please select ingredient']"
                      class="flex-grow-1"
                      item-text="name"
                      item-value="name"
                      label="Ingredient"
                      light
                      required
                      v-model="editedItem.name"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      label="Amount"
                      min="0"
                      type="number"
                      v-model="editedItem.amount"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      label="Units"
                      v-model="editedItem.unit"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="close" color="blue darken-1" text>Cancel</v-btn>
              <v-btn @click="save" color="blue darken-1" text>Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon @click="editItem(item)" class="mr-2" small>mdi-pencil</v-icon>
      <v-icon @click="deleteItem(item)" small>mdi-delete</v-icon>
    </template>
    <template v-slot:no-data>No ingredients added</template>
  </v-data-table>
</template>

<script>
import RecipeService from "@/services/recipes";

export default {
  props: ["value"],

  data: () => ({
    dialog: false,
    headers: [
      {
        text: "Ingredient",
        align: "start",
        value: "name"
      },
      { text: "Amount", value: "amount" },
      { text: "Units", value: "unit" },
      { text: "Actions", value: "actions" }
    ],
    availableIngredients: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      amount: "",
      unit: ""
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Ingredient" : "Edit Ingredient";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  mounted() {
    RecipeService.ingredientsData().then(response => {
      this.availableIngredients = response;
    });
  },

  methods: {
    editItem(item) {
      this.editedIndex = this.value.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.value.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.value.splice(index, 1);
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (typeof this.editedItem.name !== "string") {
        // Combobox selected items will appear as objects, typed items will be strings
        this.editedItem.id = this.editedItem.name.id;
        this.editedItem.name = this.editedItem.name.name;
      } else {
        this.editedItem.id = Math.floor(Math.random() * 100) + 50;
      }

      if (this.editedIndex > -1) {
        Object.assign(this.value[this.editedIndex], this.editedItem);
      } else {
        this.value.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>
