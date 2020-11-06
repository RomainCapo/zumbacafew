<template>
  <div ref="svganchor" class="graph centered"></div>
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
      default: 40,
    },
    circle_hide_radius: {
      type: Number,
      default: 5,
    },
    explode_force: {
      type: Number,
      default: 45,
    },
    height: {
      type: Number,
      default: 600,
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
      default: 1200,
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
        .attr("width", this.width)
        .attr("height", this.height);

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

      this.paramGender = { men: "men", woman: "woman", all: "all" };
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

      this.beeswarmParams = {};
      this.beeswarmParams.gender = this.paramGender.all;
      this.beeswarmParams.artistType = this.paramArtistType.all;
      this.beeswarmParams.year = this.paramYear.all;

      // Display x axis label
      this.svg
        .append("text")
        .attr("x", this.width / 2)
        .attr("y", this.height)
        .style("text-anchor", "middle")
        .text("Nombre de mots");

      // Display x axis label
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
          return d["vocab_ratio"];
        })
      );

      let xAxis = d3.axisBottom(this.xScale).ticks(25).tickSizeOuter(0);

      d3.select(".x.axis").call(xAxis);

      this.computeBeeswarmSimulation(this.xScale);

      // Create country circles
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
              "<strong>Nom: " +
                d.name +
                "</strong><br>Mot unique par musique: " +
                Helper.round(d.vocab_ratio) +
                "<br>Genre: " +
                Helper.sexToFrench(d.gender) +
                "<br>Type d'artiste: " +
                Helper.artistTypeToFrench(d.artist_type) +
                "<br>Année: " +
                d.year +
                "<br>Nombre de musique: " +
                d.number_songs
            )
            .style("top", event.y - 12 + "px")
            .style("left", event.x + 25 + "px")
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
      // Create simulation with specified dataset
      let simulation = d3
        .forceSimulation(this.artistsStats)
        // Apply positioning force to push nodes towards desired position along X axis
        .force(
          "x",
          d3
            .forceX(function (d) {
              // Mapping of values from total/perCapita column of dataset to range of SVG chart (<margin.left, margin.right>)
              return xscale(+d["vocab_ratio"]); // This is the desired position
            })
            .strength(2)
        ) // Increase velocity
        .force("y", d3.forceY(this.height / 2 - this.margin.bottom / 2)) // // Apply positioning force to push nodes towards center along Y axis
        .force("collide", d3.forceCollide(this.explode_force)) // Apply collision force with radius of 9 - keeps nodes centers 9 pixels apart
        .stop(); // Stop simulation from starting automatically

      // Manually run simulation
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
            this.beeswarmParams.year == this.paramYear.all)
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
      }
      this.applyFilter();
    },
    search(e, searchBar, radioButtonGroups) {
      let input = e.value;

      if (input.length == 1) {
        this.resetFilter(radioButtonGroups);
        radioButtonGroups.forEach((x) => {
          x.disable(true);
        });
      }

      if (input.length == 0) {
        radioButtonGroups.forEach((x) => {
          x.disable(false);
        });
      }

      searchBar.removePropositions();

      this.artistsStats.forEach((x) => {
        let name = x.name.toLowerCase();

        if (name.includes(input.toLowerCase())) {
          if (input != "") {
            searchBar.addElement(x.name);
          }
          this.focusArtist(x.name);
        } else {
          this.hideArtist(x.name);
        }
      });
    },
    resetFilter(radioButtons) {
      radioButtons.forEach((x) => {
        x.reset();
      });

      this.beeswarmParams.gender = "All";
      this.beeswarmParams.artistType = "All";
      this.beeswarmParams.year = "All";

      this.applyFilter();
    },
  },
};
</script>