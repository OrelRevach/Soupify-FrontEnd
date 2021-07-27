import axios from "axios";
import store from "@/store/index";
import router from "@/router/index";

export const BASE_URL = `https://soupify.herokuapp.com/api`;

// Create client
const httpClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
  // Try attaching token upon sending a request
  transformRequest: [
    function(data, headers) {
      const token = store.getters.token;
      if (token) headers["Authorization"] = `Bearer ${token}`;
      return JSON.stringify(data);
    }
  ],
  // Headers
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

// Configure interceptors
httpClient.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    // Logout on UNAUTHORIZED because the token has timed out
    if (error.response.status === 401)
      store.dispatch("logout").then(() => {
        if (router.currentRoute.path !== "/") router.push("/login");
      });
    return Promise.reject(error);
  }
);

export default httpClient;
