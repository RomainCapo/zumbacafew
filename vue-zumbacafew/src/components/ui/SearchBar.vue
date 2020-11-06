<template>
  <div class="col-sm" style="text-align: center">
    <label for="input-artist-search"><strong>{{ legend }}</strong></label>
    <input type="text" class="form-control" ref="inputArtistSearch" id="input-artist-search" @input="searchInput" />
    <div ref="proposedArtistsContainer" v-for="prop in propositions" v-bind:key="prop">
      <div class="proposed-artist" @click="propositionClick">{{ prop }}</div>
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

      this.$refs.inputArtistSearch.value = e.target.textContent;
      this.$refs.inputArtistSearch.dispatchEvent(new Event("input"));
    },
  },
};
</script>
