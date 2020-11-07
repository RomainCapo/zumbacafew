<template>
  <div
    class="row align-items-end justify-content-center"
    id="word-histogram-chart"
  >
    <StackedColumn
      v-for="bin in bins"
      v-bind:key="bin"
      v-bind:start="bin.start"
      v-bind:stop="bin.stop"
      v-bind:values="bin.values"
    ></StackedColumn>
  </div>
</template>


<script>
import Helper from "@/services/class/Helper.js";
import StackedColumn from "@/components/ui/StackedColumn.vue";

export default {
  name: "WordHistogram",
  components: {
    StackedColumn,
  },
  data() {
    return {
      bins: [],
    };
  },
  props: {
    artistsStats: Object,
    legend: Object,
    numberBin: {
      type: Number,
      default: 6,
    },
  },
  mounted() {
    this.bins = this._computeBin();
  },
  updated() {
    this.applyFilter("year");
  },
  methods: {
    _getInterval() {
      let values = [];
      this.artistsStats.forEach((x) => {
        values.push(x.vocab_number_unique_word);
      });

      return {
        min: Math.floor(Math.min.apply(null, Object.values(values))),
        max: Math.ceil(Math.max.apply(null, Object.values(values))),
      };
    },
    _computeBin() {
      let minMax = this._getInterval();

      let binWidth = Math.round((minMax.max - minMax.min) / this.numberBin);

      let binvValues = [];

      this.binInterval = [];

      let binCounter = Math.floor(minMax.min);
      for (let i = 0; i <= this.numberBin; i++) {
        this.binInterval.push(Math.round(binCounter));
        binCounter += binWidth;
      }

      this.artistsStats.forEach((x) => {
        for (let i = 0; i <= this.binInterval.length; i++) {
          if (
            x.vocab_number_unique_word >= this.binInterval[i] &&
            x.vocab_number_unique_word <= this.binInterval[i + 1]
          ) {
            if (typeof binvValues[i] == "undefined") {
              binvValues[i] = [];
            }
            binvValues[i].push(x.name);
          }
        }
      });

      let histogramBin = [];
      binvValues.forEach((x, k) => {
        x.sort();
        histogramBin.push({
          start: this.binInterval[k],
          stop: this.binInterval[k + 1],
          values: x,
        });
      });
      return histogramBin;
    },

    applyFilter(criterion) {
      if (criterion != "year") {
        let criterionValues = Array.from(
          new Set(this.artistsStats.map((x) => x[criterion]))
        );

        this.artistsStats.forEach((x) => {
          let artistSpan = document.getElementById("artist" + x.name);
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

          let artistSpan = document.getElementById("artist" + x.name);
          artistSpan.className =
            "align-bottom c" +
            criterionValues.indexOf(Helper.ceilYear(x[criterion]));
        });
        this.updateLegend(criterion, criterionValues);
      }
    },
    updateLegend(criterion, criterionValues) {
      let strong = document.createElement("STRONG");
      strong.appendChild(document.createTextNode(Helper.criterionToFrench(criterion)));

      while (this.legend.firstChild) {
        this.legend.firstChild.remove();
      }
      this.legend.appendChild(strong);

      criterionValues.forEach((value, index) => {
        if (criterion == "gender") {
          
            let div = document.createElement("DIV");
            div.classList.add("c" + index)
            div.appendChild(document.createTextNode(Helper.sexToFrench(value)))

            this.legend.appendChild(div)
        } else if (criterion == "artist_type") {
            let div = document.createElement("DIV");
            div.classList.add("c" + index)
            div.appendChild(document.createTextNode(Helper.artistTypeToFrench(value)))

            this.legend.appendChild(div)
        } else {
          let div = document.createElement("DIV");
            div.classList.add("c" + index)
            div.appendChild(document.createTextNode(value))

            this.legend.appendChild(div)
        }
      });
    },
  },
};
</script>