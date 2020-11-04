<template>
  <div>
    <h1>Home</h1>
    <WordCloud
      v-if="termFrequency !== null"
      v-bind:width="800"
      v-bind:height="800"
      v-bind:termFrequency="termFrequency"
    >
    </WordCloud>
  </div>
</template>

<script>
import ArtistsApi from "@/services/api/Artists";
import WordCloud from "@/components/charts/WordCloud.vue";

export default {
  name: "Home",
  components: {
    WordCloud,
  },
  data() {
    return {
      termFrequency: null
    };
  },
  async created() {
    this.termFrequency = await ArtistsApi.getTermFrequency();
  },
};
</script>

<style scoped>
</style>
