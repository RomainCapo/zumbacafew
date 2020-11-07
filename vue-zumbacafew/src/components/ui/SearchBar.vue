<template>
  <div class="col-sm" style="text-align: center">
    <label for="input-search"><strong>{{ legend }}</strong></label>
    <input type="text" class="form-control" ref="inputSearch" id="input-search" @input="searchInput" />
    <div v-for="prop in propositions" v-bind:key="prop">
      <div class="search-proposition" @click="propositionClick">{{ prop }}</div>
    </div>
  </div>
</template>


<script>
export default {
  name: "SearchBar",
  props: {
    legend: String,
  },
  data() {
    return {
      propositions: [],
    };
  },
  methods: {
    searchInput(e) {
      this.$emit("search-input", e.target);
    },
    addElement(value) {
      this.propositions.push(value);
    },
    removePropositions() {
      this.propositions = [];
    },
    propositionClick(e) {
      this.removePropositions();

      this.$refs.inputSearch.value = e.target.textContent;
      this.$refs.inputSearch.dispatchEvent(new Event("input"));
      this.propositions = [];
    },
  },
};
</script>


<style scoped>
#input-search {
  width: 80%;
  margin: auto;
}

.search-proposition {
  margin: auto;
  width: 80%;
  border-bottom: solid 1px rgb(0, 178, 99);
  padding: 3px;
}


.search-proposition:hover {
  background: rgb(237, 239, 238);
  cursor: pointer;
}
</style>
