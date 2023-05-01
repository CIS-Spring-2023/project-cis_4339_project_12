import { defineStore } from 'pinia'
import axios from 'axios'
const apiURL = import.meta.env.VITE_ROOT_API

//defining a store
export const useLoggedInUserStore = defineStore({
  // id is only required for devtools with the Pinia store
  id: 'loggedInUser',
  //central part of the store
  state: () => {
    return {
      name: "user",
      isLoggedIn: false,
      isEditor: false
    }
  },
  // equivalent to methods in components, perfect to define business logic
  actions: {
    //login action, takes a user name an password as arguments
    async login(uName, pWord) {
      try {
        //await a response using the apiLogin function
        const response = await apiLogin(uName, pWord);
        //patch the values when promises get resolved
        this.$patch({
          name: response[0],
          isLoggedIn: response[1],
          isEditor: response[2]
        })
        this.$router.push("/");
      } catch (error) {
        console.log(error)
      }
    },
    logout() {
      this.patch({
        name: "",
        isLoggedIn: false
      });
    }
  }
});

//take a username and password as Strings
//make a post request with both as variables
async function apiLogin(u, p) {
  const response = await axios.post(`${apiURL}/login`, {
    uName: u,
    pWord: p
  })
    .then(
      function (response) {
        return response;
      })
    .catch(function (error) {
      console.log(error)
      return false
    })
  //if the backend validates the credentials then return credential data set.
  if (response.data.isValidated == true) {
    return [response.data.username, response.data.isValidated, response.data.isEditor];
  }
  return Promise.reject(new Error("invalid credentials"));
}