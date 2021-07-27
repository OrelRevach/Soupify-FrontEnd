<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="6" xl="5">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-avatar color="black-grey">
              <v-img v-bind:src="imgUrl" v-if="imgUrl" />
              <v-icon v-else dense>mdi-account-circle</v-icon>
            </v-avatar>
            <v-toolbar-title class="ml-2 d-block text-center text-uppercase"
              >Edit Profile
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text class="card">
            <v-form
              class="d-flex flex-column"
              lazy-validation
              ref="registerForm"
              v-model="valid"
            >
              <v-row>
                <v-col>
                  <v-text-field
                    :rules="userNameRules"
                    label="Username"
                    light
                    required
                    v-model="userName"
                  ></v-text-field>
                  <v-text-field
                    label="First Name"
                    light
                    required
                    v-model="firstName"
                  ></v-text-field>
                  <v-text-field
                    label="Last Name"
                    light
                    required
                    v-model="lastName"
                  ></v-text-field>
                  <v-combobox
                    :items="countries"
                    :rules="[v => !!v || 'Please select country']"
                    item-text="name"
                    label="Country"
                    light
                    required
                    v-model="country"
                  >
                    <template slot="selection" slot-scope="{ item }">
                      <img
                        class="country-icon"
                        height="16"
                        v-bind:src="item.flag"
                        width="24"
                      />
                      <span class="mx-2"></span>
                      {{ item.name }}
                    </template>
                    <template slot="item" slot-scope="{ item }">
                      <img
                        class="country-icon"
                        height="16"
                        v-bind:src="item.flag"
                        width="24"
                      />
                      <span class="mx-2"></span>
                      {{ item.name }}
                    </template>
                  </v-combobox>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="oldPassword"
                    :rules="passwordRules"
                    label="Old Password"
                    type="password"
                    required
                    light
                  ></v-text-field>

                  <v-text-field
                    :rules="passwordRules"
                    label="New Password"
                    light
                    required
                    type="password"
                    v-model="newPassword"
                  ></v-text-field>
                  <v-text-field
                    label="Email"
                    light
                    required
                    v-model="email"
                  ></v-text-field>
                  <form
                    ref="imageUpload"
                    enctype="multipart/form-data"
                    class="d-flex align-center"
                  >
                    <v-file-input
                      accept="image/*"
                      class="flex-grow-1"
                      label="Upload New Picture"
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
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions class="d-flex flex-column card">
            <v-btn
              :disabled="!valid"
              @click="validateCredentials"
              class="mb-4 align-self-stretch"
              color="success"
              light
              >Update
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AuthService from "@/services/auth";
import countryData from "@/assets/countryData.json";
import FileService from "@/services/files";

import { passwordRules, userNameRules } from "@/core/validationRules";

export default {
  data: () => ({
    valid: true,
    userName: "",
    userNameRules: userNameRules,
    oldPassword: "",
    passwordRules: passwordRules,
    newPassword: "",
    firstName: "",
    lastName: "",
    countries: countryData,
    country: "",
    email: "",
    imgUrl: "",
    imgObj: {},
    loading: false
  }),

  created() {
    const currentUser = this.$store.getters.currentUser;
    this.userName = currentUser.login;
    this.imgUrl = currentUser.avatar;
    this.firstName = currentUser.fullname.split(" ")[0];
    this.lastName = currentUser.fullname.split(" ")[1];
    this.email = currentUser.email;
    this.country = currentUser.country;
  },

  methods: {
    async performUpload() {
      if (!this.imgObj.name) return;
      this.loading = true;
      let formData = new FormData();

      formData.append("image", this.imgObj, this.imgObj.name);

      this.imgUrl = await FileService.uploadImg(formData);
      this.loading = false;
    },

    validateCredentials() {
      if (!this.$refs.registerForm.validate()) return;

      let userInfo = {
        login: this.userName,
        password: this.newPassword,
        role: "Client",
        avatar: this.imgUrl,
        fullname: this.firstName + " " + this.lastName,
        country: this.country.name,
        email: this.email,
        is_blocked: false,
        question: "Place of Birth?",
        answer: "Dimona"
      };

      AuthService.updateUser(userInfo)
        .then(() => this.$router.push("/"))
        .catch(err => console.log(err));
    }
  }
};
</script>
