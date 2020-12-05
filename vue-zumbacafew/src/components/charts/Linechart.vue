<template>
  <canvas ref="chart"></canvas>
</template>

<script>
import Chart from 'chart.js';

export default {
    name: 'LineChart',
    mounted() {
        var chart = this.$refs.chart;
        var ctx = chart.getContext("2d");
        var data = {
          labels: ["2012", "2013", "2014", "2015", "2016"],
          datasets: [
            {
              label: "Word",
              data: [5, 200, 120, 12, 15],
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

        new Chart(ctx, {
          type: "line",
          data: data,
          options: options
        });
    },
    props: {

    },
    methods: {

    },
}
</script>

<style scoped>
</style>
