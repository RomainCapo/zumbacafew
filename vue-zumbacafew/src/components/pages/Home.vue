<template>
  <div>
    <Header />
    <div id="intro">
      <div class="container">
        <h1>Découvrez les statistiques cachées de vos rappeurs préférés !</h1>
      </div>
    </div>
    <div class="container stats">
      <p>
        Nombre d'artistes analysés:
        <strong
          v-if="artistCount !== null"
          v-html="formatNumber(artistCount.count)"
        ></strong>
      </p>
      <p>
        Nombre de musiques analysées :
        <strong
          v-if="songCount !== null"
          v-html="formatNumber(songCount.count)"
        ></strong>
      </p>
      <p>
        Nombre de mots analysés :
        <strong
          v-if="wordCount !== null"
          v-html="formatNumber(wordCount.count)"
        ></strong>
      </p>
      <p>
        Nombre d'années analysées :
        <strong
          v-if="minYear !== null && maxYear !== null"
          v-html="formatNumber(maxYear.max - minYear.min)"
        ></strong>
      </p>
    </div>
    <div class="container annotation">
      <p>
        Vous avez toujours voulu savoir si le vocabulaire d'un rappeur était
        plus riche que celui d'un autre ? Si le rap c'était mieux avant ? Si le
        vocabulaire de <a href="https://genius.com/artists/Booba">Booba</a> est
        plus riche que celui de
        <a href="https://genius.com/artists/Kaaris">Kaaris</a> ?
      </p>
      <p>Le graphique suivant va vous donner la réponse !</p>
    </div>
    <div id="beeswarm-container">
      <h2 class="title">Nombre de mots uniques par artistes</h2>
      <div class="container justify-content-center">
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
    <div class="container annotation">
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
    <div id="word-histogram-container">
      <div class="container">
        <h2 class="title">Histogramme du nombre de mot uniques par artiste</h2>
        <WordHistogram
          v-if="artistsStats !== null"
          v-bind:artistsStats="artistsStats"
          v-bind:legend="this.$refs.legendContainer"
          ref="wordHistogram"
          id="word-histogram"
        />
        <div id="xaxis-legend">Nombre de mot</div>
        <div id="source">Source: <a href="https://genius.com">Genius</a></div>
        <div class="row">
          <div class="col-sm">
            <span ref="legendContainer" id="legend-container">
              <strong>Année</strong><br />
              <span class="y1990">1990</span><br />
              <span class="y2000">2000</span><br />
              <span class="y2010">2010</span><br />
              <span class="y2020">2020</span>
            </span>
          </div>
          <div class="col-sm">
              <label for="input-number-bin"><strong>Nombre de collones : </strong></label>
              <input
                type="number"
                class="form-control"
                id="input-number-bin"
                min="3"
                max="10"
                value="6"
                @input="inputNumberEvent"
              />
          </div>
          <div class="col-sm">
            <span id="criterion-container">
              <GroupRadio
                v-bind:legend="'Critère'"
                v-bind:radioGroup="'criterions'"
                v-bind:filters="filtersName"
                v-on:radio-btn-clicked="filterWordHistogram"
                ref="radioCriterions"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="container annotation">
      <p>
        Ce graphique présente une autre vue du premier graphique. Chaque
        artistes est disposé dans une collonne en fonction de la richesse de son
        vocabulaire
      </p>
    </div>
    <hr class="annotation-separator" />
    <div class="container annotation">
      <p>
        Vous voulez découvrir quels sont les mots les plus fréquents dans le rap
        français ? Quel termes sont les plus utilisés par un artiste ? Si le mot
        le plus utilisé par
        <a href="https://genius.com/artists/Wejdene">Wejdene</a>
        est Coco ?
      </p>
      <p>Vous êtes au bon endroit !</p>
    </div>
    <div id="word-cloud-container">
      <div class="container">
        <h2 class="title">Nuage de mots de {{ selectedWordCloudArtist }}</h2>
        <div class="row">
          <div class="col-sm-9">
            <img
              v-if="isWordCloudLoading"
              src="res/svg/bars.svg"
              width="50"
              alt="word-cloud-loader"
            />
            <WordCloud
              v-if="termFrequency !== null"
              v-show="!isWordCloudLoading"
              v-bind:termFrequency="termFrequency"
              ref="wordCloud"
              id="word-cloud"
            />
          </div>
          <div class="col-sm-3">
            <SearchBar
              v-if="artists !== null"
              v-bind:values="artists"
              v-bind:legend="'Recherche d\'artistes'"
              v-bind:idName="'wordcloud'"
              v-on:search-input="searchWordCloudKeyBoard"
              v-on:search-input-click="searchWordCloud"
              ref="searchWordCloudBar"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="container annotation">
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sunt natus,
        reprehenderit quibusdam dolorum aliquid error deleniti aut corporis
        iusto, accusamus sequi voluptatem eos quisquam aliquam! Atque sequi
        libero quod magni? Plus d'information <a href="">ici</a>
      </p>
    </div>
    <hr class="annotation-separator" />
    <div class="container annotation">
      <p>
        Vous souhaitez connaître l'évolution de l'utilisation d'un mot dans les chansons au fur à mesure des années ?
        C'est le graphique ci-dessous qui vous donnera la réponse.
      </p>
      <p>L'évolution d'un mot est représenté par le nombre de fois qu'il a été utilisé dans l'ensemble des chansons d'une année civile.</p>
    </div>
    <div id="word-cloud-container">
      <div class="container">
        <p>graphique...</p>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import ArtistsApi from "@/services/api/Artists";
import Beeswarm from "@/components/charts/Beeswarm.vue";
import Header from "@/components/layout/Header";
import GroupRadio from "@/components/ui/GroupRadio.vue";
import WordHistogram from "@/components/charts/WordHistogram.vue";
import SearchBar from "@/components/ui/SearchBar.vue";
import WordCloud from "@/components/charts/WordCloud.vue";
import Footer from "@/components/layout/Footer";

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
      isWordCloudLoading: false,
      selectedWordCloudArtist: "tous les artistes",
      songCount: null,
      wordCount: null,
      minYear: null,
      maxYear: null,
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
      filtersIsComplete: [
        {
          key: "all",
          value: "Tous les artistes",
        },
        {
          key: "complete",
          value: "Seuil atteint",
        },
        {
          key: "incomplete",
          value: "Seuil non atteint",
        },
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
    inputNumberEvent(e){
      let criterion = this.$refs.radioCriterions.currentValue
      this.$refs.wordHistogram.numberInputEvent(e.target.value, criterion)
    },
    filterBeeSwarm(e) {
      this.$refs.beeswarm.filter(e);
    },
    searchBeeSwarm(propositions) {
      this.$refs.beeswarm.search(propositions, [
        this.$refs.radioSex,
        this.$refs.radioArtistType,
        this.$refs.radioYear,
        this.$refs.radioIsComplete,
      ]);
    },
    filterWordHistogram(e) {
      this.$refs.wordHistogram.applyFilter(e.value);
    },
    async searchWordCloud(proposition) {
      this.isWordCloudLoading = true;
      this.selectedWordCloudArtist = proposition;
      const termFrequency = await ArtistsApi.getTermFrequencyByArtist(
        proposition
      );
      this.isWordCloudLoading = false;
      this.$refs.wordCloud.drawChart(termFrequency);
    },
    async searchWordCloudKeyBoard(propositions) {
      if (
        propositions.length === 0 &&
        this.selectedWordCloudArtist !== "tous les artistes"
      ) {
        this.selectedWordCloudArtist = "tous les artistes";
        this.isWordCloudLoading = true;
        const termFrequency = await ArtistsApi.getTermFrequency();
        this.isWordCloudLoading = false;
        this.$refs.wordCloud.drawChart(termFrequency);
      }
    },
    formatNumber(number, separator = "'") {
      return number.toLocaleString("en-US").replace(/,/g, separator);
    },
  },
};
</script>
