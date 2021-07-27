import Vue from "vue";
import Vuex from "vuex";
import authModule from "./modules/auth";
import mealModule from "./modules/meal";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth: authModule,
    meal: mealModule
  },
  state: {
    savedSearch: JSON.parse(localStorage.getItem("search"))
  },
  mutations: {
    save_search_data(state, searchData) {
      state.savedSearch = searchData;
    },
    clear_search_data(state) {
      state.savedSearch = null;
    }
  },
  actions: {
    saveSearch({ commit }, searchData) {
      localStorage.setItem("search", JSON.stringify(searchData));
      commit("save_search_data", searchData);
    }
  },
  getters: {
    savedSearch: state => state.savedSearch
  }
});
