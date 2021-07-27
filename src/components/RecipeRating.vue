<template>
  <!-- Rating -->
  <div class="rating-item">
    <span class="text--white">{{ rating }}</span>
    <v-icon class="ml-1" style="top: -3.5px">mdi-star</v-icon>
  </div>
</template>

<script>
export default {
  name: "RecipePage",
  props: ["rating"]
};
</script>

<style scoped>
span {
  font-size: 1.5em;
  line-height: 1.7em;
  font-weight: 400;
}

span,
.v-icon {
  color: white !important;
}

.rating-item {
  background-color: #f5b041 !important;
  border-style: solid;
  border-width: 1px;
  border-color: #f5b041 !important;
  border-radius: 16px;
  font-size: 12px;
  padding: 2px 12px;
}
</style>
