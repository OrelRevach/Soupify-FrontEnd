<template>
  <v-btn
    :input-value="active"
    class="primary"
    text
    v-bind:to="!disableNav ? route : undefined"
    v-on="activator"
  >
    <slot />
  </v-btn>
</template>

<script>
export default {
  name: "MenuLink",
  props: ["route", "activator", "disableNav"],
  data: () => ({ active: false }),
  mounted() {
    this.routeWatcher = this.$watch(
      () => this.$route,
      route => {
        if (this.route === "/") this.active = route.fullPath === "/";
        else this.active = route.fullPath.startsWith(this.route);
      }
    );
  }
};
</script>

<style scoped>
.v-btn {
  height: 100% !important;
  border-radius: 0;
}
</style>
