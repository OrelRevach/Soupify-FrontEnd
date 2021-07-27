<template>
  <v-card class="elevation-12">
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title class="d-block text-center text-uppercase">
        <v-toolbar-title class="d-block text-center text-uppercase">
          <v-icon size="27" class="mr-2">mdi-login</v-icon>Login
        </v-toolbar-title>
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text class="card">
      <v-alert v-if="error" class="pa-3" dense light outlined type="error"
        >Incorrect <strong>username</strong> or <strong>password</strong>.
      </v-alert>
      <v-form
        class="d-flex flex-column"
        lazy-validation
        ref="loginForm"
        v-model="valid"
      >
        <v-text-field
          label="Username"
          light
          prepend-icon="mdi-account"
          required
          v-model="userName"
        ></v-text-field>

        <v-text-field
          label="Password"
          light
          prepend-icon="mdi-key"
          required
          type="password"
          v-model="password"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions class="d-flex flex-column card">
      <v-btn
        :disabled="!valid"
        @click="validateCredentials"
        class="mb-4 align-self-stretch"
        color="success"
        light
        >Login
      </v-btn>

      <router-link class="lbl text-center" to="/register"
        >Don't have an account? Register now.
      </router-link>
      <router-link
        class="lbl text-center"
        to="/password-reset"
        style="font-size: smaller"
        >Forgot your password?
      </router-link>
    </v-card-actions>
  </v-card>
</template>

<script>
import AuthService from "@/services/auth";
import { passwordRules, userNameRules } from "../core/validationRules";

export default {
  name: "LoginForm",

  data: () => ({
    valid: true,
    userName: "",
    userNameRules: userNameRules,
    password: "",
    passwordRules: passwordRules,
    error: ""
  }),

  methods: {
    validateCredentials() {
      if (!this.$refs.loginForm.validate()) return;

      let userCredentials = {
        login: this.userName,
        password: this.password
      };

      AuthService.login(userCredentials)
        .then(() => this.$router.push("/"))
        .catch(err => {
          this.error = err;
        });
    }
  }
};
</script>

<style scoped>
.lbl:hover {
  text-decoration: underline;
}
</style>
