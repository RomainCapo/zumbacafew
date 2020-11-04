<template>
  <div>
    <Header/>
    <Beeswarm/>
    <WordCloud
      v-if="termFrequency !== null"
      v-bind:width="800"
      v-bind:height="800"
      v-bind:termFrequency="termFrequency"
    >
    </WordCloud>
    <Footer/>
  </div>
</template>

<script>
import ArtistsApi from "@/services/api/Artists";
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import WordCloud from "@/components/charts/WordCloud.vue";

export default {
  name: "Home",
  components: {
    Footer,
    Header,
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
