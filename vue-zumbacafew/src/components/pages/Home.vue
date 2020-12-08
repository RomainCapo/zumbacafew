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
        Le graphique beeswarm permet de comparer efficacement le vocabulaire
        entre deux artistes à partir de la distance qui les sépare sur l'axe x.
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
            <label for="input-number-bin"
              ><strong>Nombre de colonnes : </strong></label
            >
            <select
              class="form-control"
              id="input-number-bin"
              @input="inputNumberEvent"
            >
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6" selected="selected">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
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
        artiste est disposé dans une colonne en fonction de la richesse de son
        vocabulaire
      </p>
      <p>
        L'histogramme d'artiste permet de comparer efficacement la richesse du
        vocabulaire entre deux artistes ou une catégorie d'artiste (genre,
        année, etc). Cette représentation permet une comparaison du vocabulaire
        des artistes en fonction de la catégorie de l'histogramme à laquel ils
        appartiennent.
      </p>
    </div>
    <hr class="annotation-separator" />
    <div class="container annotation">
      <p>
        Vous voulez découvrir quels sont les mots les plus fréquents dans le rap
        français ? Quels termes sont les plus utilisés par un artiste ? Si le mot
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
        Le nuage de mot permet de répondre à la question de la fréquence des
        mots par rapport à l'ensemble des titres analysés ou pour un artiste en
        particulier. La représentation permet de comparer efficacement
        l'utilisation d'un mot par rapport à un autre en fonction de la taille
        qu'il occupe sur le graphique.
      </p>
      <p>
        Initialement le graphique représente les mots de tous les artistes
        confondus. Il est également possible d'afficher la fréquence de mot pour
        un artiste en utilisant la barre de recherche à droite du graphique.
      </p>
    </div>
    <hr class="annotation-separator" />
    <div class="container annotation">
      <p>
        Vous souhaitez connaître l'évolution de l'utilisation d'un mot dans les
        chansons au fur au cours du temps ? Le graphique ci-dessous vous donnera la réponse.
      </p>
      <p>
        L'évolution d'un mot est représentée par le nombre de fois qu'il a été
        utilisé dans l'ensemble des chansons d'une année civile.
      </p>
    </div>
    <div id="line-chart-container">
      <div class="container">
        <h2 class="title">Évolution d'un mot au cours des années</h2>
        <div class="row searchBarLinechart">
          <div class="col-lg-4 col-sm-12">
            <div class="annotation">
              <p>Mot actuel : {{ wordDisplayed }}</p>
            </div>
          </div>
          <div class="col-lg-4 col-sm-12 selectorGraph">
            <GroupRadio
              v-if="termFrequencyByYear !== null"
              v-bind:legend="'Type de graphe'"
              v-bind:radioGroup="'linechart'"
              v-bind:filters="filtersGraph"
              v-on:radio-btn-clicked="filterLinechart"
              ref="radioLinechart"
            />
          </div>
          <div class="col-lg-4 col-sm-12 selectorGraph">
            <SearchBar
              v-if="terms !== null && termFrequencyByYear !== null"
              v-bind:values="terms"
              v.bind:idName="'wordsLinechart'"
              v-bind:legend="'Recherche de mots'"
              v-bind:idName="'linechart'"
              v-on:search-input-click="searchLinechart"
              ref="searchLinechartBar"
            />
          </div>
        </div>
        <LineChart
          ref="lineChart"
          id="lineChart"
          v-if="termFrequencyByYear !== null"
          v-bind:termFrequencyByYear="termFrequencyByYear"
        />
        <div id="source">Source: <a href="https://genius.com">Genius</a></div>
      </div>
    </div>
    <div class="container annotation">
      <p>
        Les deux derniers graphiques permettent de répondre à la question de
        l'évolution de l'utilisation en fonction du temps. Le line chart ainsi
        que l'histogramme permettent de suivre la variation de l'utilisation
        d'un mot d'une année à l'autre.
      </p>
      <p>
        Les boutons radio permettent de changer la représentation du graphe d'un
        line chart à un histogramme. La barre de recherche permet quant à elle
        de rechercher les mots pour lequel l'utilisateur souhaite visualiser
        l'évolution au fil des années.
      </p>
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
import LineChart from "@/components/charts/Linechart.vue";
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
    LineChart,
  },
  data() {
    return {
      artists: null,
      terms: null,
      artistsStats: null,
      artistCount: null,
      isWordCloudLoading: false,
      selectedWordCloudArtist: "tous les artistes",
      wordDisplayed: "police",
      songCount: null,
      wordCount: null,
      minYear: null,
      maxYear: null,
      filtersGraph: [
        {
          key: "line",
          value: "Line chart",
        },
        {
          key: "bar",
          value: "Bar chart",
        },
      ],
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
      termFrequencyByYear: null,
      graphType: "line",
    };
  },
  async created() {
    this.terms = await ArtistsApi.getTerms();
    this.artists = await ArtistsApi.getArtists();
    this.artistsStats = await ArtistsApi.getStats();
    this.termFrequency = await ArtistsApi.getTermFrequency();
    this.termFrequencyByYear = await ArtistsApi.getTermFrequencyByYear(
      this.wordDisplayed
    );
    this.artistCount = await ArtistsApi.getArtistCount();
    this.songCount = await ArtistsApi.getSongCount();
    this.wordCount = await ArtistsApi.getWordCount();
    this.minYear = await ArtistsApi.getMinYear();
    this.maxYear = await ArtistsApi.getMaxYear();
  },
  methods: {
    inputNumberEvent(e) {
      let criterion = this.$refs.radioCriterions.currentValue;
      this.$refs.wordHistogram.numberInputEvent(e.target.value, criterion);
      this.$refs.radioCriterions.getRadios()[
        "radio-criterions-year"
      ].checked = true;
    },
    filterBeeSwarm(e) {
      this.$refs.beeswarm.filter(e);
    },
    searchBeeSwarm(propositions) {
      this.$refs.beeswarm.search(propositions, [
        this.$refs.radioSex,
        this.$refs.radioArtistType,
        this.$refs.radioYear,
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
    async searchLinechart(term) {
      this.$refs.lineChart.destroyChart();
      const termFrequencyByYear = await ArtistsApi.getTermFrequencyByYear(term);
      this.$refs.lineChart.drawLinechart(termFrequencyByYear, this.graphType);
      this.wordDisplayed = term;
    },
    async filterLinechart(e) {
      this.$refs.lineChart.destroyChart();
      this.graphType = e.value;
      const termFrequencyByYear = await ArtistsApi.getTermFrequencyByYear(
        this.wordDisplayed
      );
      this.$refs.lineChart.drawLinechart(termFrequencyByYear, this.graphType);
    },
    formatNumber(number, separator = "'") {
      return number.toLocaleString("en-US").replace(/,/g, separator);
    },
  },
};
</script>
