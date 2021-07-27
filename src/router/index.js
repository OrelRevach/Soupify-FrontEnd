import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue")
  },
  {
    path: "/search",
    name: "Search",
    component: () => import("../views/Search.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/register",
    name: "Register",
    component: Register
  },
  {
    path: "/recipe/:id",
    name: "Recipe Details",
    component: () => import("../views/RecipePage.vue")
  },
  {
    path: "/recipe-cook/:id",
    name: "Recipe Cook",
    component: () => import("../views/RecipeCook.vue")
  },
  {
    path: "/create",
    name: "Recipe Creation",
    component: () => import("../views/RecipeCreate.vue")
  },
  {
    path: "/personal/recipes",
    name: "My Recipes",
    component: () => import("../views/MyRecipes.vue")
  },
  {
    path: "/personal/favorite",
    name: "Favorite Recipes",
    component: () => import("../views/FavRecipes.vue")
  },
  {
    path: "/personal/family",
    name: "Family Recipes",
    component: () => import("../views/FamilyRecipes.vue")
  },
  {
    path: "/password-reset/",
    name: "Password Reset",
    component: () => import("../views/PasswordReset.vue")
  },
  {
    path: "/personal/profile/",
    name: "Profile",
    component: () => import("../views/Profile.vue")
  },
  {
    path: "/personal/meal/",
    name: "Meal",
    component: () => import("../views/Meal.vue")
  },
  {
    path: "*",
    name: "404",
    component: () => import("../views/404.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
