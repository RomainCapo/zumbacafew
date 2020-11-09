<template>
  <footer class="footer fixed-bottom">
    <div class="panel-footer container">
      <span class="text-white">Copyright &copy; 2020, Zumba Cafew</span>
      <span class="text-white"
        ><a href="https://www.instagram.com/"
          ><img
            src="res/img/instagram_logo.png"
            alt="instagram"
            width="30"
            height="30" /></a
      ></span>
      <span class="text-white">Un projet de la Team 5.8</span>
    </div>
  </footer>
</template>


<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
.footer {
  margin-top: 30px;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 60px;
  line-height: 60px;
  background-color: rgb(0, 178, 99);
}

.panel-footer {
  display: flex;
  justify-content: space-between;
}
</style>