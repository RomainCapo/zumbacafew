<template>
  <div ref="svgwordcloud"></div>
</template>

<script>
import * as d3 from "d3";
import * as cloud from "d3-cloud";
import * as d3scale from "d3-scale";

export default {
  name: "ChartWordCloud",
  props: {
    height: {
      type: Number,
      default: 1400,
    },
    marginBottom: {
      type: Number,
      default: 0,
    },
    marginLeft: {
      type: Number,
      default: 40,
    },
    marginRight: {
      type: Number,
      default: 40,
    },
    marginTop: {
      type: Number,
      default: 0,
    },
    termFrequency: Object,
    width: {
      type: Number,
      default: 1400,
    },
  },
  mounted() {
    this.drawChart(this.termFrequency);
  },
  methods: {
    drawChart(termFrequency) {
      let maxFrequency = Math.max.apply(
        Math,
        termFrequency.map(function (o) {
          return o.count;
        })
      );

      d3.select(this.$refs.svgwordcloud).select("svg").remove();

      const MIN_FONT = 30;
      const MAX_FONT = 150;
      let fontSizeScale = d3.scaleLinear().domain([0, 1]).range([MIN_FONT, MAX_FONT]);

      this.svg = d3
        .select(this.$refs.svgwordcloud)
        .append("svg")
        .attr("viewBox", "0 0 " + (this.width + this.marginLeft + this.marginRight) + " " + (this.height + this.marginTop + this.marginBottom))
        .append("g")
        .attr(
          "transform",
          "translate(" + this.marginLeft + "," + this.marginTop + ")"
        );

      this.svg
        .append("text")
        .attr("x", 40)
        .attr("y", this.height)
        .style("font-size", "20px")
        .style("text-anchor", "left")
        .html("Source: <a href='https://genius.com'>Genius</a>");

      this.layout = cloud()
        .size([this.width, this.height])
        .words(
          termFrequency.map(function (d) {
            return {
              text: d._id,
              size: d.count / maxFrequency
            };
          })
        )
        .padding(10)
        .rotate(function () {
          return ~~(Math.random() * 2) * 90;
        })
        .fontSize(function (d) {
          return fontSizeScale(d.size);
        })
        .on("end", this.drawWord);
      this.layout.start();
    },
    drawWord(word) {
      let colors = d3scale
        .scaleLinear()
        .domain([1, 50])
        .range(['#8e59ab', '#00b263']);

      this.svg
        .append("g")
        .attr("viewBox", "0 0 " + this.width + " " + this.height)
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
