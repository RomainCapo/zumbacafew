(function () {
    d3.json("http://localhost:8080/api/artists/termfrequency").then(data => {

        let myWords = data;
        let mostFrequentWord = Math.max.apply(Math, myWords.map(function (o) { return o.count; }));

        var margin = { top: 0, right: 40, bottom: 34, left: 40 },
            width = 800,
            height = 800;

        var svg = d3.select("#svgwordcloud").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var xScale = d3.scaleLinear()
            .range([0, width]);

        var layout = d3.layout.cloud()
            .size([width, height])
            .words(myWords.map(function (d) { return { text: d._id, size: (d.count / mostFrequentWord) }; }))
            .padding(2)
            .rotate(function () { return ~~(Math.random() * 2) * 90; })
            .fontSize(function (d) { return d.size * width / 3; })
            .on("end", draw);
        layout.start();

        function draw(words) {
            var colors = d3.scaleSequential().domain([1, myWords.length]).range(["#8E59AB", "#00B263"]);

            svg.append("g")
                .attr("width", width)
                .attr("height", height)
                .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function (d) { return d.size + "px"; })
                .style("fill", (d) => colors(d.size))
                .attr("text-anchor", "middle")
                .style("font-family", "Impact")
                .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function (d) { return d.text; });
        }
    })
})();





