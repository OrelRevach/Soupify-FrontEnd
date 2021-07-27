<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col class="shrink" cols="7" xl="3">
        <v-card class="elevation-1">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title class="d-block text-center text-uppercase"
              >Password Reset
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text class="card black--text" align="center">
            <p
              class="mt-5"
              v-if="this.question !== ''"
              v-show="password === ''"
            >
              your question is : <b>{{ this.question }}</b>
            </p>
            <p v-else class="mt-5">
              Enter your <b>Soupify username</b>, or the
              <b>email address</b> that you used to register. We'll send you an
              email with your reset question to reset your password.
              <br />
            </p>
            <p class="mt-10" style="font-size: large" v-if="password !== ''">
              your new password is : <b>{{ this.password }} </b> keep it!
            </p>
          </v-card-text>
          <v-card-text class="card">
            <v-form
              class="d-flex flex-column"
              lazy-validation
              ref="forgotPassword"
            >
              <v-text-field
                v-if="this.question === ''"
                label="Email address or username"
                light
                required
                v-model="username"
              >
              </v-text-field>
              <v-text-field
                v-else
                v-show="password === ''"
                label="Your answer here!"
                light
                required
                v-model="answer"
              >
              </v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions class="d-flex flex-column card">
            <v-btn
              class="mb-4"
              style="min-width: 10em"
              light
              rounded
              @click="formPost"
              color="success"
              >SEND
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AuthService from "@/services/auth";
export default {
  data() {
    return {
      username: "",
      question: "",
      answer: "",
      password: ""
    };
  },
  methods: {
    formPost() {
      if (this.password !== "") {
        this.$router.push("/login");
        return;
      }
      if (this.question === "") {
        let userCredentials = {
          login: this.username.toLowerCase()
        };
        AuthService.getQuestion(userCredentials)
          .then(q => (this.question = q))
          .catch(err => {
            if (err.name !== "NavigationDuplicated") console.log(err);
          });
      } else {
        let userAnswer = {
          login: this.username.toLowerCase(),
          answer: this.answer
        };
        AuthService.postAnswer(userAnswer)
          .then(password => (this.password = password))
          .catch(err => {
            if (err.name !== "NavigationDuplicated") console.log(err);
          });
      }
    }
  }
};
</script>
