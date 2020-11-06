<template>
  <div id="word-histogram">
    <!--<h1 class="title">Histogramme du nombre de mot unique par artiste</h1>-->
    <div class="container">
      <span id="legend-container">
        <div><strong>Année</strong></div>
        <div class="y1990">1990</div>
        <div class="y2000">2000</div>
        <div class="y2010">2010</div>
        <div class="y2020">2020</div>
      </span>
      <span id="criterion-container">
        <strong>Critères</strong>
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            name="radio-word-histogram"
            id="radio-year"
            value="year"
            checked
          />
          <label class="form-check-label" for="radio-year">Année</label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            name="radio-word-histogram"
            id="radio-sex"
            value="gender"
          />
          <label class="form-check-label" for="radio-sex">Sexe</label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            name="radio-word-histogram"
            id="radio-artist-type"
            value="artist_type"
          />
          <label class="form-check-label" for="radio-artist-type"
            >Type d'artiste</label
          >
        </div>
      </span>
      <div class="row align-items-end" id="word-histogram-chart"></div>
      <div id="xaxis-legend" style="text-align: center">Nombre de mots</div>
      <div id="source">Source: <a href="https://genius.com">Genius</a></div>
    </div>
  </div>
</template>
<script>
import Helper from "@/services/class/Helper.js";

export default {
  name: "WordHistogram",
  props: {
    artistsStats: Object,
    numberBin: {
      type: Number,
      default: 6,
    },
  },
  mounted() {
    this.init();

    let div = document.getElementById("word-histogram-chart");
    this.computeHistogram(div);
  },
  methods: {
    init() {
      this.radioButtons = document.querySelectorAll(
        "#word-histogram input[type='radio']"
      );
      this.addEventListnerRadioButtons();
    },
    _getInterval() {
      let values = [];
      this.artistsStats.forEach((x) => {
        values.push(x.vocab_ratio);
      });

      return {
        min: Math.floor(Math.min.apply(null, Object.values(values))),
        max: Math.ceil(Math.max.apply(null, Object.values(values))),
      };
    },
    _computeBin() {
      let minMax = this._getInterval();

      let binWidth = Math.round((minMax.max - minMax.min) / this.numberBin);

      let histogramBin = {};

      this.binInterval = [];

      let binCounter = Math.floor(minMax.min);
      for (let i = 0; i <= this.numberBin; i++) {
        this.binInterval.push(Math.round(binCounter));
        binCounter += binWidth;
      }

      this.artistsStats.forEach((x) => {
        for (let i = 0; i <= this.binInterval.length; i++) {
          if (
            x.vocab_ratio >= this.binInterval[i] &&
            x.vocab_ratio <= this.binInterval[i + 1]
          ) {
            if (typeof histogramBin[i] == "undefined") {
              histogramBin[i] = [];
            }
            histogramBin[i].push(x);
          }
        }
      });
      return histogramBin;
    },
    computeHistogram(div) {
      let bins = this._computeBin();

      let html = "";
      for (let i = 0; i < Object.keys(bins).length; i++) {
        html += '<div class="col-sm">';
        bins[i].sort((a, b) => (a.vocab_ratio < b.vocab_ratio ? 1 : -1)); // Sort artist

        for (let j = 0; j < Object.keys(bins[i]).length; j++) {
          html +=
            '<span id="artist' +
            Helper.replaceStringSpace(bins[i][j].name) +
            '">' +
            bins[i][j].name +
            "</span><br>";
        }

        // Legend for each bin
        html += '<hr/><span">';

        if (i == 0) {
          html += "- " + Helper.round(this.binInterval[i + 1]);
        } else if (i == Object.keys(bins).length - 1) {
          html += "+ " + Helper.round(this.binInterval[i]);
        } else {
          html +=
            Helper.round(this.binInterval[i]) +
            " - " +
            Helper.round(this.binInterval[i + 1]);
        }
        html += "</span></div>";
      }
      div.innerHTML = html;

      this.applyFilter("year");
    },
    addEventListnerRadioButtons() {
      this.radioButtons.forEach((elem) => {
        elem.addEventListener("input", (x) => {
          this.applyFilter(x.target.value);
        });
      });
    },
    applyFilter(criterion) {
      if (criterion != "year") {
        let criterionValues = Array.from(
          new Set(this.artistsStats.map((x) => x[criterion]))
        );

        this.artistsStats.forEach((x) => {
          let artistSpan = document.getElementById(
            "artist" + Helper.replaceStringSpace(x.name)
          );
          artistSpan.className =
            "align-bottom c" + criterionValues.indexOf(x[criterion]);
        });
        this.updateLegend(criterion, criterionValues);
      } else {
        let criterionValues = Array.from(
          new Set(this.artistsStats.map((x) => Helper.ceilYear(x[criterion])))
        );
        criterionValues.sort();

        this.artistsStats.forEach((x) => {
          let artistSpan = document.getElementById(
            "artist" + Helper.replaceStringSpace(x.name)
          );
          artistSpan.className =
            "align-bottom c" +
            criterionValues.indexOf(Helper.ceilYear(x[criterion]));
        });
        this.updateLegend(criterion, criterionValues);
      }
    },
    updateLegend(criterion, criterionValues) {
      this.legendContainer = document.getElementById("legend-container");
      let html = "<strong>" + Helper.criterionToFrench(criterion) + "</strong>";

      criterionValues.forEach((value, index) => {
        if (criterion == "gender") {
          html +=
            "<div class='c" +
            index +
            "'>" +
            Helper.sexToFrench(value) +
            "</div>";
        } else if (criterion == "artist_type") {
          html +=
            "<div class='c" +
            index +
            "'>" +
            Helper.artistTypeToFrench(value) +
            "</div>";
        } else {
          html += "<div class='c" + index + "'>" + value + "</div>";
        }
      });
      this.legendContainer.innerHTML = html;
    },
  },
};
</script>