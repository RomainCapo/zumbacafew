<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <img src="res/img/logo.png" alt="logo" height="80" id="logo"/>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Header",
};
</script>

<style scoped>
#logo {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 5px;
}

nav {
  background-color: rgb(255, 255, 255) !important;
  border-bottom: 1px solid rgb(0, 178, 99);
}

.nav-link {
  color: rgb(0, 178, 99) !important;
}

.nav-link:hover {
  color: gray !important;
}

nav a {
  font-size: 24px;
}

nav .navbar-brand {
  font-size: 36px;
  margin-right: 60px;
}

nav img {
  margin-right: 25px;
}

nav h1 {
  position: absolute;
  margin-left: 80px;
}
</style>
