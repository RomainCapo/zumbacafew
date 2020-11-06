<template>
  <div class="col-sm" style="text-align: center">
    <strong> {{ legend }} </strong>
    <div class="form-check" v-for="filter in filters" v-bind:key="filter">
      <input
        class="form-check-input"
        type="radio"
        :name="'radio-' + radioGroup"
        ref="radio-{{ radioGroup }}-{{ filter.key }}"
        :id="'radio-' + radioGroup + '-' + filter.key"
        :value="filter.key"
        v-model="checked"
        @click="radioBtnClicked"
      />
      <label
        class="form-check-label"
        :for="'radio-' + radioGroup + '-' + filter.key"
      >
        {{ filter.value }}
      </label>
    </div>
  </div>
</template>


<script>
export default {
  name: "GroupRadio",
  data() {
    return {
      checked: "all",
    };
  },
  props: {
    filters: Array,
    legend: String,
    radioGroup: String,
  },
  methods: {
    radioBtnClicked(e) {
      this.$emit("radio-btn-clicked", e.target);
    },
  },
};
</script>
