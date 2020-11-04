<template>
  <div ref="svgwordcloud"></div>
</template>

<script>
// TODO only import necessary
import * as d3 from "d3";
import * as cloud from "d3-cloud";
import * as d3scale from "d3-scale";

export default {
  name: "ChartWordCloud",
  props: {
    height: {
      type: Number,
      default: 800
    },
    marginBottom: {
      type: Number,
      default: 34
    },
    marginLeft: {
      type: Number,
      default: 40
    },
    marginRight: {
      type: Number,
      default: 40
    },
    marginTop: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 800
    },
    termFrequency: Object
  },
  mounted() {
    this.drawChart();
  },
  methods: {
    drawChart() {
      let maxFrequency = Math.max.apply(
        Math,
        this.termFrequency.map(function (o) {
          return o.count;
        })
      );

      this.svg = d3
        .select(this.$refs.svgwordcloud)
        .append("svg")
        .attr("width", this.width + this.marginLeft + this.marginRight)
        .attr("height", this.height + this.marginTop + this.marginBottom)
        .append("g")
        .attr(
          "transform",
          "translate(" + this.marginLeft + "," + this.marginTop + ")"
        );

      this.layout = cloud()
        .size([this.width, this.height])
        .words(
          this.termFrequency.map(function (d) {
            return { text: d._id, size: d.count / maxFrequency };
          })
        )
        .padding(4)
        .rotate(function () {
          return ~~(Math.random() * 2) * 90;
        })
        .fontSize(function (d) {
          return d.size * 100;
        })
        .on("end", this.drawWord);
      this.layout.start();
    },
    drawWord(word) {
      let colors = d3scale
        .scaleSequential()
        .domain([1, this.termFrequency.length])
        .range(["#8E59AB", "#00B263"]);

      this.svg
        .append("g")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr(
          "transform",
          "translate(" +
            this.layout.size()[0] / 2 +
            "," +
            this.layout.size()[1] / 2 +
            ")"
        )
        .selectAll("text")
        .data(word)
        .enter()
        .append("text")
        .style("font-size", function (d) {
          return d.size + "px";
        })
        .style("fill", (d) => colors(d.size))
        .attr("text-anchor", "middle")
        .style("font-family", "Impact")
        .attr("transform", function (d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function (d) {
          return d.text;
        });
    }
  },
};
</script>

<style scoped>
</style>