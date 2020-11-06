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
      <h1 class="title">Nombre de mots uniques par chanteur</h1>
      <div class="container">
        <Beeswarm
          ref="beeswarm"
          v-if="artistsStats !== null"
          v-bind:artistsStats="artistsStats"
        />
        <div class="row radio-button-beeswarm">
          <GroupRadio
            v-bind:legend="'Sexe'"
            v-bind:radioGroup="'sex'"
            v-bind:filters="filtersSex"
            v-on:radio-btn-clicked="filterBeeSwarm"
          />
          <GroupRadio
            v-bind:legend="'Type d\'artiste'"
            v-bind:radioGroup="'artist-type'"
            v-bind:filters="filtersArtistType"
            v-on:radio-btn-clicked="filterBeeSwarm"
          />
          <GroupRadio
            v-bind:legend="'Decenie'"
            v-bind:radioGroup="'year'"
            v-bind:filters="filtersDecade"
            v-on:radio-btn-clicked="filterBeeSwarm"
          />
        </div>
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
import Beeswarm from "@/components/charts/Beeswarm.vue";
import Footer from "@/components/layout/Footer";
import GroupRadio from "@/components/ui/GroupRadio.vue";
import Header from "@/components/layout/Header";
import WordCloud from "@/components/charts/WordCloud.vue";
import WordHistogram from "@/components/charts/WordHistogram.vue";

export default {
  name: "Home",
  components: {
    Beeswarm,
    Footer,
    GroupRadio,
    Header,
    WordCloud,
    WordHistogram,
  },
  data() {
    return {
      artistsStats: null,
      filtersArtistType: [
        { key: "all", value: "Les deux" },
        { key: "individual", value: "Individuel" },
        { key: "group", value: "Groupe" },
      ],
      filtersDecade: [
        { key: "all", value: "Toutes les années" },
        { key: "1990", value: "1990" },
        { key: "2000", value: "2000" },
        { key: "2010", value: "2010" },
        { key: "2020", value: "2020" },
      ],
      filtersSex: [
        { key: "all", value: "Les deux" },
        { key: "men", value: "Homme" },
        { key: "woman", value: "Femme" },
      ],
      termFrequency: null,
    };
  },
  async created() {
    this.artistsStats = await ArtistsApi.getStats();
    this.termFrequency = await ArtistsApi.getTermFrequency();
  },
  methods: {
    filterBeeSwarm(e) {
      this.$refs.beeswarm.filter(e);
    }
  }
};
</script>
