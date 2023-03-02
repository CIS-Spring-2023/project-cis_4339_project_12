<template>
  <div class="flex justify-center items-center h-screen">
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" @submit.prevent="login">
      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2" for="username">
          Username
        </label>
        <input
          v-model="username"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          type="text"
          placeholder="Username"
        />
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 font-bold mb-2" for="password">
          Password
        </label>
        <input
          v-model="password"
          class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          placeholder="********"
        />
        <p class="text-red-500 text-xs italic">{{ errorMessage }}</p>
      </div>
      <div class="flex items-center justify-between">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Sign In
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

const apiURL = import.meta.env.VITE_ROOT_API;

export default {
  name: "LoginPage",
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    login() {
      const userData = {
        username: this.username,
        password: this.password,
      };

      axios
        .post(`${apiURL}/login`, userData)
        .then((res) => {
          // save token and user role to localStorage or Vuex store
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("role", res.data.role);

          // redirect to dashboard
          this.$router.push("/");
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        });
    },
  },
};
</script>

<style>
/* styles for login page */
</style>
