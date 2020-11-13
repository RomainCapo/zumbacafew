<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <span class="navbar-brand">Zumba Cafew</span>
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

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <a class="nav-link" href="#beeswarm">Nuage d'artistes</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#word-histogram">Histogramme</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#word-cloud">Nuage de mots</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Header",
};
</script>

<style scoped>
nav {
  background-color: rgb(255, 255, 255) !important;
  border-bottom: 1px solid rgb(0, 178, 99);
}

.nav-link {
  color:rgb(0, 178, 99) !important;
}

.nav-link:hover {
  color:gray !important;
}

nav a {
  font-size: 24px;
}

nav .navbar-brand {
  font-size: 36px;
  margin-right: 60px;
}

nav img {
  margin-right: 5px;
}

nav h1 {
  position: absolute;
  margin-left: 80px;
}
</style>