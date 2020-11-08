<template>
  <div>
    <Header />

    <div id="intro">
      <div class="container inter-text">
        <p id="left">Découvrez les statistiques cachées</p>
        <p id="right">de vos rappeurs préférés !</p>
      </div>
    </div>
    <div class="container stats">
      <p>
        Nombre d'artistes analysés:
        <strong v-if="artistCount !== null">{{
          formatNumber(artistCount.count)
        }}</strong>
      </p>
      <p>
        Nombre de musiques analysées :
        <strong v-if="songCount !== null">{{
          formatNumber(songCount.count)
        }}</strong>
      </p>
      <p>
        Nombre de mots analysés :
        <strong v-if="wordCount !== null">{{
          formatNumber(wordCount.count)
        }}</strong>
      </p>
      <p>
        Nombre d'années analysés :
        <strong v-if="minYear !== null && maxYear !== null">{{
          formatNumber(maxYear.max - minYear.min)
        }}</strong>
      </p>
    </div>
    <div class="container inter-text annotation">
      <p>
        Vous avez toujours voulu savoir si le vocabulaire d'un rappeur était
        plus riche que celui d'un autre ? Si le rap c'était mieux avant ? Si le
        vocabulaire de <a href="https://genius.com/artists/Booba">Booba</a> est
        plus riche que celui de
        <a href="https://genius.com/artists/Kaaris">Kaaris</a> ?
      </p>
      <p>Le graphique suivant va vous donner la réponse !</p>
    </div>
    <div id="beeswarm">
      <h1 class="title">Nombre de mots uniques par artistes</h1>
      <div class="container">
        <Beeswarm
          ref="beeswarm"
          v-if="artistsStats !== null"
          v-bind:artistsStats="artistsStats"
          id="beeswarm"
        />
        <div class="row radio-button-beeswarm">
          <GroupRadio
            v-bind:legend="'Sexe'"
            v-bind:radioGroup="'sex'"
            v-bind:filters="filtersSex"
            v-on:radio-btn-clicked="filterBeeSwarm"
            ref="radioSex"
          />
          <GroupRadio
            v-bind:legend="'Type d\'artiste'"
            v-bind:radioGroup="'artist-type'"
            v-bind:filters="filtersArtistType"
            v-on:radio-btn-clicked="filterBeeSwarm"
            ref="radioArtistType"
          />
          <GroupRadio
            v-bind:legend="'Decenie'"
            v-bind:radioGroup="'year'"
            v-bind:filters="filtersDecade"
            v-on:radio-btn-clicked="filterBeeSwarm"
            ref="radioYear"
          />
          <GroupRadio
            v-bind:legend="'Seuil atteint'"
            v-bind:radioGroup="'is-complete'"
            v-bind:filters="filtersIsComplete"
            v-on:radio-btn-clicked="filterBeeSwarm"
            ref="radioIsComplete"
          />
          <SearchBar
            v-if="artists !== null"
            v-bind:values="artists"
            v-bind:legend="'Recherche d\'artistes'"
            v-bind:idName="'beeswarm'"
            v-on:search-input="searchBeeSwarm"
            ref="searchBeeswarm"
          />
        </div>
      </div>
    </div>

    <div class="container inter-text annotation">
      <p>
        Toutes les données de ce projet proviennent du site web
        <a href="https://genius.com/">Genius</a>. Pour chaque artiste, le nombre
        de mots uniques est calculé sur un ensemble de
        <strong>20'000 mots</strong> récupérés sur ses musiques les plus
        populaires. Les artistes qui n'atteignent pas ce seuil sont précisés via
        une annotation.
      </p>
      <p>
        Le graphique permet de filtrer les artistes selon leur
        <strong>sexe</strong>, s'il s'agit
        <strong>d'un groupe ou d'un artiste solo</strong> et
        <strong>l'année</strong> de celui ci.
      </p>
      <p>
        La décennie à laquelle appartient chaque artiste est calculée à partir
        de la moyenne de ses musiques les plus populaires.
      </p>
    </div>
    <div id="word-histogram">
      <div class="container">
        <h1 class="title">Histogramme du nombre de mot uniques par artiste</h1>
        <span ref="legendContainer" id="legend-container">
          <div><strong>Année</strong></div>
          <div class="y1990">1990</div>
          <div class="y2000">2000</div>
          <div class="y2010">2010</div>
          <div class="y2020">2020</div>
        </span>
        <span id="criterion-container">
          <GroupRadio
            v-bind:legend="'Critère'"
            v-bind:radioGroup="'criterions'"
            v-bind:filters="filtersName"
            v-on:radio-btn-clicked="filterWordHistogram"
          />
        </span>
        <WordHistogram
          v-if="artistsStats !== null"
          v-bind:artistsStats="artistsStats"
          v-bind:legend="this.$refs.legendContainer"
          ref="wordHistogram"
          id="word-histogram"
        />
      </div>
    </div>
    <div class="container inter-text annotation">
      <p>
        Ce graphique présente une autre vue du premier graphique. Chaque
        artistes est disposé dans une collonne en fonction de la richesse de son
        vocabulaire
      </p>
    </div>
    <hr class="annotation-separator" />
    <div class="container inter-text annotation">
      <p>
        Vous voulez découvrir quels sont les mots les plus fréquents dans le rap
        français ? Quel termes sont les plus utilisés par un artiste ? Si le mot
        le plus utilisé par
        <a href="https://genius.com/artists/Wejdene">Wejdene</a>
        est Coco ?
      </p>
      <p>Vous êtes au bon endroit !</p>
    </div>
    <div class="container">
      <div class="rows">
        <div class="col-sm">
          <WordCloud
            v-if="termFrequency !== null"
            v-bind:termFrequency="termFrequency"
            ref="wordCloud"
            id="word-cloud"
          />
        </div>
        <div class="col-sm">
          <SearchBar
            v-if="artists !== null"
            v-bind:values="artists"
            v-bind:legend="'Recherche d\'artistes'"
            v-bind:idName="'wordcloud'"
            v-on:search-input-click="searchWordCloud"
            ref="searchWordCloudBar"
          />
        </div>
      </div>
    </div>
    <div class="container inter-text annotation">
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
import SearchBar from "@/components/ui/SearchBar.vue";

export default {
  name: "Home",
  components: {
    Beeswarm,
    Footer,
    GroupRadio,
    Header,
    WordCloud,
    WordHistogram,
    SearchBar,
  },
  data() {
    return {
      artists: null,
      artistsStats: null,
      artistCount: null,
      songCount: null,
      wordCount: null,
      minYear : null,
      maxYear : null,
      filtersArtistType: [
        {
          key: "all",
          value: "Les deux",
        },
        {
          key: "individual",
          value: "Individuel",
        },
        {
          key: "group",
          value: "Groupe",
        },
      ],
      filtersDecade: [
        {
          key: "all",
          value: "Toutes les années",
        },
        {
          key: "1990",
          value: "1990",
        },
        {
          key: "2000",
          value: "2000",
        },
        {
          key: "2010",
          value: "2010",
        },
        {
          key: "2020",
          value: "2020",
        },
      ],
      filtersSex: [
        {
          key: "all",
          value: "Les deux",
        },
        {
          key: "men",
          value: "Homme",
        },
        {
          key: "woman",
          value: "Femme",
        },
      ],
      filtersIsComplete:[
        {
          key: "all",
          value: "Tous les artistes"
        },
        {
          key: "complete",
          value: "Seuil atteint"
        },
        {
          key: "incomplete",
          value: "Seuil non atteint"
        }
      ],
      filtersName: [
        {
          key: "year",
          value: "Année",
        },
        {
          key: "gender",
          value: "Sexe",
        },
        {
          key: "artist_type",
          value: "Type d artiste",
        },
      ],
      termFrequency: null,
    };
  },
  async created() {
    this.artists = await ArtistsApi.getArtists();
    this.artistsStats = await ArtistsApi.getStats();
    this.termFrequency = await ArtistsApi.getTermFrequency();
    this.artistCount = await ArtistsApi.getArtistCount();
    this.songCount = await ArtistsApi.getSongCount();
    this.wordCount = await ArtistsApi.getWordCount();
    this.minYear = await ArtistsApi.getMinYear();
    this.maxYear = await ArtistsApi.getMaxYear();
  },
  methods: {
    filterBeeSwarm(e) {
      this.$refs.beeswarm.filter(e);
    },
    searchBeeSwarm(propositions) {
      this.$refs.beeswarm.search(propositions, [
        this.$refs.radioSex,
        this.$refs.radioArtistType,
        this.$refs.radioYear,
        this.$refs.radioIsComplete
      ]);
    },
    filterWordHistogram(e) {
      this.$refs.wordHistogram.applyFilter(e.value);
    },
    async searchWordCloud(proposition) {
      const termFrequency = await ArtistsApi.getTermFrequencyByArtist(
        proposition
      );
      this.$refs.wordCloud.drawChart(termFrequency);
    },
    formatNumber(number, separator = "'") {
      return number.toLocaleString("en-US").replace(/,/g, separator);
    },
  },
};
</script>
