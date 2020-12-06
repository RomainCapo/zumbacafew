<template>
    <div class="stacked-column" >
        <div class="col-sm align-middle" v-for="value in values" v-bind:key="value">
            <span :id="'artist' + value" >{{ value }}</span><br>
        </div>
        <hr/>
        <span>
            {{ label }}
        </span>
    </div>
</template>


<script>

export default {
  name: "StackedColumn",
  props:{
      values:Array,
      start: Number,
      stop : Number,
      label : String,
      cssWidth : Number
  }
};
</script>
<style scoped>

</style>
