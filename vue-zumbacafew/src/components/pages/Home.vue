<template>
  <div>
    <Header/>
    <Beeswarm v-if="artistsStats !== null" v-bind:artistsStats="artistsStats"/>
    <WordHistogram v-if="artistsStats !== null" v-bind:artistsStats="artistsStats"/>
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
import Beeswarm from '@/components/charts/Beeswarm.vue';
import WordCloud from "@/components/charts/WordCloud.vue";
import WordHistogram from "@/components/charts/WordHistogram.vue"

export default {
  name: "Home",
  components: {
    Footer,
    Header,
    Beeswarm,
    WordCloud,
    WordHistogram
  },
  data() {
    return {
      termFrequency: null,
      artistsStats: null,
    };
  },
  async created() {
    this.termFrequency = await ArtistsApi.getTermFrequency();
    this.artistsStats = await ArtistsApi.getStats();
  },
};
</script>

<style scoped>
</style>
