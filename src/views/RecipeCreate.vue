<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title class="d-block text-center text-uppercase"
              ><v-icon size="25" class="mr-2 mb-1">mdi-pencil-remove</v-icon
              >Create a recipe</v-toolbar-title
            >
          </v-toolbar>
          <v-card-text class="card pt-0">
            <v-form
              class="d-flex flex-column"
              ref="recipeForm"
            >
              <v-row>
                <v-col cols="6">
                  <v-toolbar flat light color="white">
                    <v-toolbar-title>Description</v-toolbar-title>
                  </v-toolbar>
                  <v-row>
                    <v-col class="pt-0">
                      <v-text-field
                        :append-icon="
                          title ? 'mdi-comma-circle-outline' : 'mdi-comma'
                        "
                        label="Title"
                        light
                        required
                        v-model="title"
                      ></v-text-field>
                      <v-text-field
                        label="Meal Count"
                        :append-icon="
                          serving ? 'mdi-glass-mug-variant' : 'mdi-glass-mug'
                        "
                        light
                        min="1"
                        required
                        type="number"
                        v-model="serving"
                      ></v-text-field>
                      <v-text-field
                        label="Ready In Minutes"
                        light
                        :append-icon="
                          ready_in_minutes
                            ? 'mdi-clock-check-outline'
                            : 'mdi-clock-alert-outline'
                        "
                        min="1"
                        required
                        type="number"
                        v-model="ready_in_minutes"
                      ></v-text-field>
                    </v-col>
                    <v-col class="pt-0 pl-5 ml-5">
                      <v-checkbox
                        label="Vegan?"
                        :append-icon="vegan ? 'mdi-leaf' : 'mdi-leaf-off'"
                        color="success"
                        light
                        style="width: 70%"
                        required
                        v-model="vegan"
                      ></v-checkbox>

                      <v-checkbox
                        label="Vegetarian?"
                        :append-icon="
                          vegetarian ? 'mdi-food-steak' : 'mdi-food-steak-off'
                        "
                        color="red darken-3"
                        light
                        style="width: 70%"
                        v-model="vegetarian"
                      ></v-checkbox>

                      <v-checkbox
                        label="Gluten Free?"
                        :append-icon="
                          gluten_free ? 'mdi-barley' : 'mdi-barley-off'
                        "
                        color="#F5B041"
                        light
                        style="width: 70%"
                        v-model="gluten_free"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <form
                        ref="imageUpload"
                        enctype="multipart/form-data"
                        class="d-flex align-center"
                      >
                        <v-file-input
                          accept="image/*"
                          class="flex-grow-1"
                          label="Upload Image"
                          light
                          required
                          name="file"
                          v-model="imgObj"
                          id="imageInput"
                        ></v-file-input>
                        <v-btn
                          :loading="loading"
                          @click="performUpload"
                          class="ml-4 small white--text"
                          color="blue-grey"
                          fab
                          outlined
                          small
                        >
                          <v-icon dark>mdi-cloud-upload</v-icon>
                        </v-btn>
                      </form>
                    </v-col>
                    <v-col class="d-flex align-center justify-space-end">
                      <label class="v-label theme--light mr-4">Preview:</label>
                      <v-avatar color="primary">
                        <v-img v-bind:src="imgUrl" v-if="imgUrl" />
                        <v-icon v-else>mdi-pot-mix</v-icon>
                      </v-avatar>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-textarea
                      label="Instructions"
                      light
                      outlined
                      requireds
                      :append-icon="
                        instructions
                          ? 'mdi-clipboard-list-outline'
                          : 'mdi-clipboard-outline'
                      "
                      style="text-align:center"
                      v-model="instructions"
                      value="The Woodman set to work at once, and so sharp"
                    />
                  </v-row>
                </v-col>
                <v-col cols="6">
                  <EditIngredients v-bind:value="extended_ingredients" />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>

          <v-card-actions class="d-flex flex-column card">
            <v-btn
              @click="sendForm"
              class="mb-4 align-self-stretch"
              color="success"
              light
              >Create</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import RecipeService from "@/services/recipes";
import FileService from "@/services/files";
import EditIngredients from "@/components/EditIngredients";

export default {
  components: { EditIngredients },

  data: () => ({
    title: "",
    vegan: false,
    vegetarian: false,
    gluten_free: false,
    serving: "",
    ready_in_minutes: "",
    imgUrl: "",
    aggregate_likes: 0,
    instructions: "",
    extended_ingredients: [],
    selectedIngredient: null,

    imgObj: {},
    loading: false,
    toggle: false,
    unit: "",
    amount: null,
    amounts: false,
    ingName: ""
  }),

  methods: {
    sendForm() {
      let recipeInfo = {
        title: this.title,
        ready_in_minutes: this.ready_in_minutes,
        aggregate_likes: 0,
        serving: this.serving,
        vegetarian: this.vegetarian,
        vegan: this.vegan,
        gluten_free: this.gluten_free,
        image: this.imgUrl,
        instructions: this.instructions,
        extended_ingredients: this.extended_ingredients
      };

      RecipeService.addRecipe(recipeInfo)
        .then(() => this.$router.push("/personal/recipes"))
        .catch(err => console.log(err));
    },

    async performUpload() {
      if (!this.imgObj.name) return;
      this.loading = true;
      let formData = new FormData();

      formData.append("image", this.imgObj, this.imgObj.name);

      this.imgUrl = await FileService.uploadImg(formData);
      this.loading = false;
    }
  }
};
</script>
