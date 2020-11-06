<template>
  <div>
    <Header />
    <div id="intro">
      <div class="container inter-text">
        <p id="left">Découvrez les statistiques cachées</p>
        <p id="right">de vos rappeurs préférés !</p>
      </div>
    </div>

    <div id="beeswarm">
      <div class="container">
        <Beeswarm
          v-if="artistsStats !== null"
          v-bind:artistsStats="artistsStats"
        />
      </div>
    </div>
    

    <div class="container inter-text">
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sunt natus,
        reprehenderit quibusdam dolorum aliquid error deleniti aut corporis
        iusto, accusamus sequi voluptatem eos quisquam aliquam! Atque sequi
        libero quod magni? Plus d'information <a href="">ici</a>
      </p>
    </div>
    <WordHistogram
      v-if="artistsStats !== null"
      v-bind:artistsStats="artistsStats"
    />
    <div class="container inter-text">
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sunt natus,
        reprehenderit quibusdam dolorum aliquid error deleniti aut corporis
        iusto, accusamus sequi voluptatem eos quisquam aliquam! Atque sequi
        libero quod magni? Plus d'information <a href="">ici</a>
      </p>
    </div>
    <WordCloud
      v-if="termFrequency !== null"
      v-bind:width="800"
      v-bind:height="800"
      v-bind:termFrequency="termFrequency"
    >
    </WordCloud>
    <div class="container inter-text">
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sunt natus,
        reprehenderit quibusdam dolorum aliquid error deleniti aut corporis
        iusto, accusamus sequi voluptatem eos quisquam aliquam! Atque sequi
        libero quod magni? Plus d'information <a href="">ici</a>
      </p>
    </div>
    <Footer />
  </div>
</template>

<script>
import ArtistsApi from "@/services/api/Artists";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Beeswarm from "@/components/charts/Beeswarm.vue";
import WordCloud from "@/components/charts/WordCloud.vue";
import WordHistogram from "@/components/charts/WordHistogram.vue";

export default {
  name: "Home",
  components: {
    Footer,
    Header,
    Beeswarm,
    WordCloud,
    WordHistogram,
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
