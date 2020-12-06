<template>
  <canvas ref="chart"></canvas>
</template>

<script>
import Chart from 'chart.js';

export default {
    name: 'LineChart',
    props: {
      termFrequencyByYear: Object,
    },
    data() {
      return {
        drawingChart: null
      };
    },
    mounted() {
        this.drawLinechart(this.termFrequencyByYear, "line");
    },
    methods: {
        drawLinechart(termFrequencyByYear, type) {
            var labels_year = [];
            var data_count = [];
            var word = "";
            termFrequencyByYear.map(function (d) {
              labels_year.push(d._id.year);
              data_count.push(d.count);
              word = d._id.word;
            });

            var chart = this.$refs.chart;
            var ctx = chart.getContext("2d");
            var data = {
              labels: labels_year,
              datasets: [
                {
                  label: word,
                  data: data_count,
                  backgroundColor: "#00C663",
                  borderColor: "#00C663",
                  fill: false,
                  lineTension: 0,
                  radius: 6
                }
              ]
            };

            var options = {
              responsive: true,
              legend: {
                display: true,
                position: "bottom",
                labels: {
                  fontColor: "#333",
                  fontSize: 16
                }
              },
              scales: {
                yAxes: [{
                  ticks: {
                    min: 0
                  },
                  scaleLabel: {
                    display: true,
                    labelString: "Nombre de mots"
                  }
                }],
                xAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: "Année"
                  }
                }]
              },
            };

            this.drawingChart = new Chart(ctx, {
              type: type,
              data: data,
              options: options
            });
        },
        destroyChart() {
            this.drawingChart.destroy();
        }
    },
}
</script>

<style scoped>
</style>
