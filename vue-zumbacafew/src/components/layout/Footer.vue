<template>
    <footer class="footer">
        <div class="panel-footer container align-items-center">
            <span class="text-white">Copyright &copy; 2022, Zumba Cafew</span>
            <span class="text-white"><a href="https://github.com/RomainCapo/zumbacafew"><img src="res/img/github-logo.png" alt="github" width="40" height="40"></a></span>
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
    background-color: rgb(0, 178, 99);
}

.panel-footer {
    display: flex;
    justify-content: space-between;
    height: 100%;
  }

</style>