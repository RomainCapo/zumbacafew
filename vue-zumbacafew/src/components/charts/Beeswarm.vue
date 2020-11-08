<template>
  <div ref="svganchor" class="graph centered" id="test"></div>
</template>

<script>
import * as d3 from "d3";
import Helper from "@/services/class/Helper.js";

export default {
  name: "Beeswarm",
  props: {
    artistsStats: Object,
    circle_focus_radius: {
      type: Number,
      default: 25,
    },
    circle_hide_radius: {
      type: Number,
      default: 5,
    },
    explode_force: {
      type: Number,
      default: 25,
    },
    height: {
      type: Number,
      default: 500,
    },
    marginBottom: {
      type: Number,
      default: 34,
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
    width: {
      type: Number,
      default: 1000,
    },
  },
  mounted() {
    this.init();
    this.computeChart();
  },

  methods: {
    init() {
      this.margin = {
        top: this.marginTop,
        right: this.marginRight,
        bottom: this.marginBottom,
        left: this.marginLeft,
      };

      this.svg = d3
        .select(this.$refs.svganchor)
        .append("svg")
        .attr("viewBox", "0 0 " + this.width + " " + this.height )
        .attr("preserveAspectRatio", "xMidYMid meet");


      this.svg
        .append("g")
        .attr("class", "x axis")
        .attr(
          "transform",
          "translate(0," + (this.height - this.margin.bottom) + ")"
        );

      this.xLine = this.svg
        .append("line")
        .attr("stroke", "rgb(0,0,0)")
        .attr("stroke-dasharray", "10,5");

      this.tooltip = d3
        .select(this.$refs.svganchor)
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      this.paramGender = {
        men: "men",
        woman: "woman",
        all: "all",
      };
      this.paramArtistType = {
        individual: "individual",
        group: "group",
        all: "all",
      };
      this.paramYear = {
        y1990: "1990",
        y2000: "2000",
        y2010: "2010",
        y2020: "2020",
        all: "all",
      };
      this.paramIsComplete = {
        all: "all",
        complete: "complete",
        incomplete: "incomplete",
      };

      this.beeswarmParams = {};
      this.beeswarmParams.gender = this.paramGender.all;
      this.beeswarmParams.artistType = this.paramArtistType.all;
      this.beeswarmParams.year = this.paramYear.all;
      this.beeswarmParams.is_complete = this.paramIsComplete.all;

      this.svg
        .append("text")
        .attr("x", this.width / 2)
        .attr("y", this.height)
        .style("text-anchor", "middle")
        .text("Nombre de mots");

      this.svg
        .append("text")
        .attr("x", 40)
        .attr("y", this.height)
        .style("font-size", "10px")
        .style("text-anchor", "left")
        .html("Source: <a href='https://genius.com'>Genius</a>");
    },
    computeChart() {
      this.xScale = d3
        .scaleLinear()
        .range([this.margin.left, this.width - this.margin.right]);

      this.xScale.domain(
        d3.extent(this.artistsStats, function (d) {
          return d["vocab_number_unique_word"];
        })
      );

      let xAxis = d3.axisBottom(this.xScale).ticks(25).tickSizeOuter(0);

      d3.select(".x.axis").call(xAxis);

      this.computeBeeswarmSimulation(this.xScale);

      let circles = this.svg
        .selectAll(".artists")
        .data(this.artistsStats, function (d) {
          return d;
        });

      this.artistsStats.forEach((d) => {
        this.svg
          .append("svg:pattern")
          .attr("id", "artist_" + Helper.replaceStringSpace(d.name))
          .attr("width", 1)
          .attr("height", 1)
          .append("svg:image")
          .attr("stroke-width", 0)
          .attr("xlink:href", d.image_url)
          .attr("width", this.circle_focus_radius * 2)
          .attr("height", this.circle_focus_radius * 2)
          .attr("x", 0)
          .attr("y", 0)
          .attr("preserveAspectRatio", "none");
      });

      circles
        .enter()
        .append("circle")
        .attr("class", "artists")
        .attr("cx", 0)
        .attr("cy", this.height / 2 - this.margin.bottom / 2)
        .attr("r", this.circle_focus_radius)
        .attr("id", function (d) {
          return "circle_" + Helper.replaceStringSpace(d.name);
        })
        .merge(circles)
        .transition()
        .duration(2000)
        .attr("cx", function (d) {
          return d.x;
        })
        .attr("cy", function (d) {
          return d.y;
        })
        .style("fill", function (d) {
          return "url(#artist_" + Helper.replaceStringSpace(d.name) + ")";
        });

      let self = this;
      d3.selectAll(".artists")
        .on("mousemove", function (event, d) {
          self.tooltip
            .html(
              "<strong>" +
                d.name +
                "</strong><br>Nombre de mots uniques: " +
                Helper.round(d.vocab_number_unique_word) +
                "<br>Genre: " +
                Helper.sexToFrench(d.gender) +
                "<br>Type d'artiste: " +
                Helper.artistTypeToFrench(d.artist_type) +
                "<br>Année: " +
                d.year +
                "<br>Nombre de musique: " +
                d.number_songs +
                "<br>Atteint le seuil de mot: " +
                Helper.isCompleteToFrench(d.is_complete)
            )
            .style("top", event.layerY - 12 + "px")
            .style("left", event.layerX + 25 + "px")
            .style("opacity", 0.9);

          self.xLine
            .attr("x1", d3.select(this).attr("cx"))
            .attr("y1", d3.select(this).attr("cy"))
            .attr("y2", self.height - self.margin.bottom)
            .attr("x2", d3.select(this).attr("cx"))
            .attr("opacity", 1);
        })
        .on("mouseout", (x) => {
          self.tooltip.style("opacity", 0);
          self.xLine.attr("opacity", 0);
          return x;
        });
    },
    computeBeeswarmSimulation(xscale) {
      let simulation = d3
        .forceSimulation(this.artistsStats)
        .force(
          "x",
          d3
            .forceX(function (d) {
              return xscale(+d["vocab_number_unique_word"]);
            })
            .strength(2)
        )
        .force("y", d3.forceY(this.height / 2 - this.margin.bottom / 2))
        .force("collide", d3.forceCollide(this.explode_force))
        .stop();

      for (let i = 0; i < this.artistsStats.length; ++i) {
        simulation.tick(10);
      }
    },
    applyFilter() {
      this.artistsStats.forEach((x) => {
        if (
          (x.gender.toLowerCase() == this.beeswarmParams.gender ||
            this.beeswarmParams.gender == this.paramGender.all) &&
          (x.artist_type.toLowerCase() == this.beeswarmParams.artistType ||
            this.beeswarmParams.artistType == this.paramArtistType.all) &&
          (Helper.ceilYear(x.year) == this.beeswarmParams.year ||
            this.beeswarmParams.year == this.paramYear.all) &&
          (Helper.criterionCompleteConversion(x.is_complete) ==
            this.beeswarmParams.is_complete ||
            this.beeswarmParams.is_complete == this.paramIsComplete.all)
        ) {
          this.focusArtist(x.name);
        } else {
          this.hideArtist(x.name);
        }
      });
    },
    focusArtist(name) {
      d3.select("#circle_" + Helper.replaceStringSpace(name))
        .transition()
        .duration(50)
        .style("fill", "url(#artist_" + Helper.replaceStringSpace(name) + ")")
        .transition()
        .duration(1000)
        .attr("r", this.circle_focus_radius);
    },
    hideArtist(name) {
      d3.select("#circle_" + Helper.replaceStringSpace(name))
        .transition()
        .duration(1000)
        .attr("r", this.circle_hide_radius)
        .transition()
        .style("fill", null);
    },
    filter(e) {
      switch (e.name) {
        case "radio-sex":
          this.beeswarmParams.gender = e.value;
          break;
        case "radio-artist-type":
          this.beeswarmParams.artistType = e.value;
          break;
        case "radio-year":
          this.beeswarmParams.year = e.value;
          break;
        case "radio-is-complete":
          this.beeswarmParams.is_complete = e.value;
          break;
      }
      this.applyFilter();
    },
    search(propositions, radioButtonGroups) {
      this.resetFilter(radioButtonGroups);
      radioButtonGroups.forEach((x) => x.disable(true));

      if (propositions.length == 0) {
        radioButtonGroups.forEach((x) => x.disable(false));
        this.artistsStats.forEach((x) => this.focusArtist(x.name));
      } else {
        this.artistsStats.forEach((x) => {
          if (propositions.includes(x.name)) {
            this.focusArtist(x.name);
          } else {
            this.hideArtist(x.name);
          }
        });
      }
    },
    resetFilter(radioButtons) {
      radioButtons.forEach((x) => {
        x.reset();
      });

      this.beeswarmParams.gender = "All";
      this.beeswarmParams.artistType = "All";
      this.beeswarmParams.year = "All";
      this.beeswarmParams.is_complete = "All";

      this.applyFilter();
    },
  },
};
</script>
<style scoped>

</style>