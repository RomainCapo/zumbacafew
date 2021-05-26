<template>
    <footer class="footer">
        <div class="panel-footer container align-items-center">
            <span class="text-white">Copyright &copy; 2020, Zumba Cafew</span>
            <span class="text-white"><a href="https://www.instagram.com/"><img src="res/img/instagram_logo.png" alt="instagram" width="30" height="30"></a></span>
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
    bottom: 0;
    width: 100%;
    height: 100px;
    line-height: 60px;
    background-color: rgb(41, 128, 185);
}

.panel-footer {
    display: flex;
    justify-content: space-between;
    height: 100%;
  }

</style>