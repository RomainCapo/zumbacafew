<template>
    <div>
        <div class="col-sm" v-for="value in values" v-bind:key="value">
            <span>{{ value }}</span><br>
        </div>
        <hr/>
        <span>
            {{ start }} - {{ stop }}
        </span>
    </div>
</template>


<script>
export default {
  name: "StackedColumn",
  props:{
      start: Number,
      stop : Number
  },
  data() {
    return {
      values: [],
    };
  },
  methods: {

  },
};
</script>
<style scoped>

</style>
