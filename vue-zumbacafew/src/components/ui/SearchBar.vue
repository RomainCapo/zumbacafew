<template>
  <div class="col-sm" style="text-align: center">
    <label :for="'search-input-' + idName"><strong>{{ legend }}</strong></label>
    <input type="text" class="form-control" ref="inputSearch" :id="'search-input-' + idName" @input="searchInput"
      @keydown="keyDown" />
    <div v-for="(prop, index) in propositions" v-bind:key="prop">
      <div :ref="'search-item-' + index" class="search-proposition"
        :class="{ 'search-proposition--selected': index === 0}" @click="propositionClick">{{ prop }}</div>
    </div>
  </div>
</template>


<script>
export default {
  name: "SearchBar",
  props: {
    idName : String,
    legend: String,
    values: Object
  },
  data() {
    return {
      propositions: [],
      previousSelectedItemIdx: 0,
      selectedItemIdx: 0,
    };
  },
  methods: {
    filterValues() {
      const inputSearch = this.$refs.inputSearch.value.toLowerCase();
      this.values.forEach(value => {
        if (inputSearch !== "" && value.name.toLowerCase().includes(inputSearch))
          this.propositions.push(value.name);
      })
    },
    keyDown(e) {
      this.previousSelectedItemIdx = this.selectedItemIdx

      switch(e.keyCode) {
        case 13:
          this.propositionEnter();
          break;
        case 38:
          this.selectedItemIdx -= this.selectedItemIdx > 0  ? 1 : 0;
          break;
        case 40:
          this.selectedItemIdx += this.selectedItemIdx < this.propositions.length - 1 ? 1 : 0;
          break;
        default:
          break;
      }

      if(this.selectedItemIdx >= 0 && this.selectedItemIdx < this.propositions.length) {
        this.$refs["search-item-" + this.previousSelectedItemIdx].classList.remove("search-proposition--selected");
        this.$refs["search-item-" + this.selectedItemIdx].classList.add("search-proposition--selected");
      }
    },
    searchInput() {
      this.removePropositions();
      this.filterValues();
      this.$emit("search-input", this.propositions);
    },
    removePropositions() {
      this.propositions = [];
    },
    propositionClick(e) {
      const query = e.target.textContent;
      this.search(query);
    },
    propositionEnter() {
      const query = this.$refs["search-item-" + this.selectedItemIdx].textContent;
      this.search(query);

      this.selectedItemIdx = 0;
      this.previousSelectedItemIdx = 0;
    },
    search(query) {
      this.$refs.inputSearch.dispatchEvent(new Event("input"));
      this.$refs.inputSearch.value = query;
      this.removePropositions();
      this.$emit("search-input-click", query);
      this.propositions.push(query);
      this.$emit("search-input", this.propositions);
      this.removePropositions();
    }
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

.search-proposition--selected {
  background: rgb(237, 239, 238);
}

.search-proposition--not-selected {
  background: rgb(247, 247, 247);
}

.search-proposition:hover {
  background: rgb(237, 239, 238);
  cursor: pointer;
}
</style>
