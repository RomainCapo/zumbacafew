(function () {
    d3.json("http://localhost:8080/api/artists/termfrequency").then(data => {

        let myWords = data;

        var margin = {top: 0, right: 40, bottom: 34, left: 40},
            width = 1200,
            height = 600;

        var svg = d3.select("#svgwordcloud").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var layout = d3.layout.cloud()
            .size([width, height])
            .words(myWords.map(function (d) { return { text: d._id, size: d.count / 100 }; }))
            .padding(0)
            .rotate(function () { return ~~(Math.random() * 2) * 90; })
            .fontSize(function (d) { return d.size; })
            .on("end", draw);
        layout.start();

        function draw(words) {
            svg.append("g")
                .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function (d) { return d.size; })
                .style("fill", "#69b3a2")
                .attr("text-anchor", "middle")
                .style("font-family", "Impact")
                .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function (d) { return d.text; });
        }
    })
})();





