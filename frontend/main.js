let height = 400;
let width = 1000;
let margin = ({top: 0, right: 40, bottom: 34, left: 40});

let svg = d3.select("#svganchor")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

let xScale = d3.scaleLinear()
    .range([margin.left, width - margin.right]);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height - margin.bottom) + ")");

// Create line that connects circle and X axis
let xLine = svg.append("line")
    .attr("stroke", "rgb(0,0,0)")
    .attr("stroke-dasharray", "10,5");

// Create tooltip div and make it invisible
let tooltip = d3.select("#svganchor").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.json("http://127.0.0.1:8080/all_artists").then( data => {
    let dataSet = data;

    redraw();

    function redraw() {

        // Set scale type based on button clicked
        xScale = d3.scaleLinear().range([ margin.left, width - margin.right ])

        xScale.domain(d3.extent(dataSet, function(d) {
            return +d["vocab_length"];
        }));

        let xAxis = d3.axisBottom(xScale).ticks(10).tickSizeOuter(0);

        d3.select(".x.axis").call(xAxis);

        // Display x axis label
        svg.append("text")
            .attr("x", width/2)
            .attr("y",  height)
            .style("text-anchor", "middle")
            .text("Nombre de mot");

        // Create simulation with specified dataset
        let simulation = d3.forceSimulation(dataSet)
            // Apply positioning force to push nodes towards desired position along X axis
            .force("x", d3.forceX(function(d) {
                // Mapping of values from total/perCapita column of dataset to range of SVG chart (<margin.left, margin.right>)
                return xScale(+d["vocab_length"]);  // This is the desired position
            }).strength(2))  // Increase velocity
            .force("y", d3.forceY((height / 2) - margin.bottom / 2))  // // Apply positioning force to push nodes towards center along Y axis
            .force("collide", d3.forceCollide(35)) // Apply collision force with radius of 9 - keeps nodes centers 9 pixels apart
            .stop();  // Stop simulation from starting automatically

        // Manually run simulation
        for (let i = 0; i < dataSet.length; ++i) {
            simulation.tick(10);
        }

        // Create country circles
        let circles = svg.selectAll(".artists")
            .data(dataSet, function(d) { return d; });
            
        dataSet.forEach((d) => {
            svg.append("svg:pattern")
                .attr("id", "artist_" + replace_string_space(d.name))
                .attr("width", 1) 
                .attr("height", 1)
                    .append("svg:image")
                    .attr("stroke-width", 0)
                    .attr("xlink:href", d.image_url)
                    .attr("width", 60)
                    .attr("height", 60)
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("preserveAspectRatio", "none")
        })

        circles.enter()
            .append("circle")
            .attr("class", "artists")
            .attr("cx", 0)
            .attr("cy", (height / 2) - margin.bottom / 2)
            .attr("r", 30)
            .attr("id", function(d) { return "circle_" + replace_string_space(d.name); })
            .merge(circles)
                .transition()
                .duration(2000)
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })
                .style("fill", function(d) { return "url(#artist_" + replace_string_space(d.name) + ")"; })


        // Show tooltip when hovering over circle (data for respective country)
        d3.selectAll(".artists").on("mousemove", function(d) {
            tooltip.html('<strong>Nom: '+d.name+'</strong><br>Vocabulaire: ' + d.vocab_length)
                .style('top', d3.event.pageY - 12 + 'px')
                .style('left', d3.event.pageX + 25 + 'px')
                .style("opacity", 0.9);

            xLine.attr("x1", d3.select(this).attr("cx"))
                .attr("y1", d3.select(this).attr("cy"))
                .attr("y2", (height - margin.bottom))
                .attr("x2",  d3.select(this).attr("cx"))
                .attr("opacity", 1);

        }).on("mouseout", function(_) {
            tooltip.style("opacity", 0);
            xLine.attr("opacity", 0);
        });

    }
})

function replace_string_space(str, symbol="_"){
    return str.replace(/\s+/g, symbol)
}


function test(){
   d3.select("#circle_Wejdene")
    .transition()
    .duration(1000)
    .attr("r", 5)
    .transition()
    .duration(1000)
    .style("fill", null)
}
