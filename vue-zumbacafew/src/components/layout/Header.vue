<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container">
      <!--<img src="res/img/logo.png" alt="logo" />-->
      <span class="navbar-brand">Zumba Cafew</span>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item active">
          </li>
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
  background-color: rgb(255, 255, 255);
  border-bottom: 1px solid rgb(0, 178, 99);
}

nav a{
  font-size: 24px;
}

nav .navbar-brand{
  font-size: 36px;
  margin-right: 60px;
}

nav img{
  margin-right: 5px;
}

nav h1 {
  position: absolute;
  margin-left: 80px;
}
</style>