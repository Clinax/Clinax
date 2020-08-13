<template>
  <v-app>
    <v-main class="primary lighten-3">
      <v-container fluid fill-height class="py-3">
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md5 lg4>
            <v-card-title class="pb-1 px-1">
              <router-link to="/" class="brand pr-2 text--primary">
                ClinaX
              </router-link>
              <small class="mb-1 mr-1">|</small>
              <small class="text--secondary">
                {{ signup ? "Sign up" : "Login" }}
              </small>
            </v-card-title>
            <v-card id="login-card" class="elevation-24">
              <v-form
                ref="authForm"
                lazy-validation
                @submit.prevent="formSubmit"
              >
                <v-card-text class="px-md-5 pt-8">
                  <v-expand-transition>
                    <div v-if="signup">
                      <v-text-field
                        v-model="user.fullname"
                        label="Full name"
                        autocomplete="name"
                        :rules="rules.name"
                        filled
                      ></v-text-field>

                      <v-text-field
                        v-model="user.email"
                        label="Email"
                        autocomplete="email"
                        type="email"
                        :rules="rules.email"
                        filled
                      ></v-text-field>
                    </div>
                  </v-expand-transition>
                  <v-text-field
                    v-model="user.username"
                    label="Username"
                    :rules="
                      (signup && rules.username) || [
                        (v) => !!v || 'Username is required',
                      ]
                    "
                    autocomplete="username"
                    :filled="signup"
                    :outlined="!signup"
                  ></v-text-field>
                  <v-text-field
                    v-model="user.password"
                    label="Password"
                    :rules="
                      (signup && rules.password) || [
                        (v) => !!v || 'Password is required',
                      ]
                    "
                    type="password"
                    :autocomplete="signup ? 'new-password' : 'current-password'"
                    :filled="signup"
                    :outlined="!signup"
                  ></v-text-field>
                  <p class="text-right mt-1" v-if="!signup">
                    <a @click="forgetPassword = true">
                      Forget Password?
                    </a>
                  </p>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-text>
                  <v-card-actions>
                    <v-btn
                      :color="signup ? 'secondary' : 'primary'"
                      :loading="loading"
                      type="submit"
                      large
                      block
                    >
                      {{ signup ? "Create" : "login" }}
                    </v-btn>
                  </v-card-actions>
                  <div class="text-center text--secondary" v-if="!signup">
                    <small>- OR -</small>
                  </div>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <template v-if="!signup">
                      <v-btn block to="/app?new-account=true" outlined>
                        Register
                      </v-btn>
                    </template>
                    <template v-else>
                      Have an account? &nbsp;
                      <router-link class="text-primary" to="/app">
                        Sign in
                      </router-link>
                    </template>
                  </v-card-actions>
                </v-card-text>
              </v-form>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>

    <snackbar v-model="snackbar.value" v-bind="snackbar"></snackbar>
  </v-app>
</template>

<script>
import { makeRequest } from "@/modules/request";
import { FIELD_EMAIL, getReqiredField } from "@/modules/regex";

export default {
  data() {
    return {
      signup: false,
      user: {
        fullname: "",
        username: "",
        password: "",
        email: "",
      },
      rules: {
        username: [
          (v) => !!v || "Username is required",
          (v) => {
            let length = (v && v.length) || 0;
            return (
              (4 <= length && length <= 16) ||
              "Username must be of 4 - 16 characters"
            );
          },
        ],
        password: getReqiredField("Password"),
        email: FIELD_EMAIL,
        name: getReqiredField("Name"),
      },
      loading: false,
    };
  },
  computed: {
    snackbar() {
      return this.$store.state.app.snackbar;
    },
  },
  watch: {
    $route() {
      this.signup = this.$route.query["new-account"] == "true";
    },
    signup() {
      this.$refs.authForm.reset();
    },
  },
  methods: {
    formSubmit() {
      if (
        (!this.signup && this.user.username && this.user.password) ||
        this.$refs.authForm.validate()
      ) {
        this.loading = true;
        let username = this.user.username;

        var path, data;
        if (this.signup) {
          data = this.user;
          path = "user";
        } else {
          path = "login";
          data = {
            username,
            password: this.user.password,
          };
        }

        makeRequest("post", path, data)
          .then(({ data }) => {
            this.loading = false;

            if (this.signup) {
              this.$router.replace("/app");
              this.showSnackbar("Account created you can now sign in");
              this.$nextTick(() => (this.user.username = username));
              return;
            }

            data.user.token = data.token;

            this.$store.commit("setUser", data.user);
            this.$store.commit("setToken", data.token);
          })
          .catch((err) => {
            this.loading = false;
            this.errorHandler(err);
          });
      }
    },
  },
  mounted() {
    this.signup = this.$route.query["new-account"] == "true";
  },
};
</script>
