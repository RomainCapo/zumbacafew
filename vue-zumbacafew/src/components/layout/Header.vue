<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container">
      <img src="res/img/logo.png" alt="logo">
      <h1 class="text-left">Zumba Cafew</h1>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style scoped>
nav{
    background-color: rgb(255, 255, 255);
    border-bottom: 1px solid rgb(0, 178, 99);
}

nav h1 {
    position: absolute;
    margin-left: 80px;
}
</style>