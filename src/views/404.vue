<template>
  <div class="section">
    <h1 class="ti">404</h1>
    <div class="page white--text">
      Ooops!!! The page you are looking for is not found
    </div>
    <a
      class="back-home white--text"
      href="https://uspeit.github.io/webenv-assignment3-client-dist/#/"
      >Back to home</a
    >
  </div>
</template>

<script>
export default {
  name: "404",

  data() {
    return {
      links: [
        {
          title: "Home",
          url: "https://github.com/Serfati/soupify-api-specs-v1.1"
        },
        {
          title: "Login",
          url: "https://github.com/Serfati/soupify-v1"
        }
      ]
    };
  }
};
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  text-align: center;
  font-family: sans-serif;
}

h1,
a {
  margin: 0;
  padding: 0;
  text-decoration: none;
}

.section {
  padding: 4rem 2rem;
}

.section .ti {
  font-size: 150px;
  color: #008b62;
  text-shadow: 1px 1px 1px #00593e, 2px 2px 1px #00593e, 3px 3px 1px #00593e,
    4px 4px 1px #00593e, 5px 5px 1px #00593e, 6px 6px 1px #00593e,
    7px 7px 1px #00593e, 8px 8px 1px #00593e, 25px 25px 8px rgba(14, 1, 1, 0.6);
}

.page {
  margin: 2rem 0;
  font-size: 20px;
  font-weight: 600;
  color: #444;
  text-shadow: 7px 7px 1px #1e3830, 8px 8px 1px #365048,
    25px 25px 8px rgba(14, 1, 1, 0.6);
}

.back-home {
  display: inline-block;
  border: 2px solid #222;
  color: #222;
  text-transform: uppercase;
  font-weight: 600;
  padding: 0.75rem 1rem 0.6rem;
  transition: all 0.2s linear;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}
.back-home:hover {
  background: cadetblue;
}
</style>
