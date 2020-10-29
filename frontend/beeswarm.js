let height = 500;
let width = 1200;
let margin = ({top: 0, right: 40, bottom: 34, left: 40});

let CIRCLE_RADIUS = 35;
let EXPLODE_FORCE = 40;

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

    let dataSet

let paramSexe = {men:"Men", woman:"Woman", all:"All"}
let paramArtistType = {individual:"Individual", group:"Group", all:"All"}
let paramYear = {y1980:"1980", y1990:"1990", y2000:"2000", y2010:"2010", all:"All"}

let beeswarmParams = {}
beeswarmParams.sexe = paramSexe.all
beeswarmParams.artistType = paramArtistType.all
beeswarmParams.year = paramYear.all

// Display x axis label
svg.append("text")
    .attr("x", width/2)
    .attr("y",  height)
    .style("text-anchor", "middle")
    .text("Nombre de mot");

// Display x axis label
svg.append("text")
    .attr("x", 40)
    .attr("y",  height)
    .style("font-size", "10px")
    .style("text-anchor", "left")
    .html("Source: <a href='https://genius.com'>Genius</a>");

d3.json("http://127.0.0.1:8080/all_artists").then( data => {
    dataSet = data;

    redraw();

    function redraw() {

        // Set scale type based on button clicked
        xScale = d3.scaleLinear().range([ margin.left, width - margin.right ])

        xScale.domain(d3.extent(dataSet, function(d) {
            return +d["vocab_length"];
        }));

        let xAxis = d3.axisBottom(xScale).ticks(10).tickSizeOuter(0);

        d3.select(".x.axis").call(xAxis);

        

        computeBeeswarmSimulation(dataSet)

        // Create country circles
        let circles = svg.selectAll(".artists")
            .data(dataSet, function(d) { return d; });
            
        dataSet.forEach((d) => {
            svg.append("svg:pattern")
                .attr("id", "artist_" + Helper.replaceStringSpace(d.name))
                .attr("width", 1) 
                .attr("height", 1)
                    .append("svg:image")
                    .attr("stroke-width", 0)
                    .attr("xlink:href", d.image_url)
                    .attr("width", CIRCLE_RADIUS*2)
                    .attr("height", CIRCLE_RADIUS*2)
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("preserveAspectRatio", "none")
        })

        circles.enter()
            .append("circle")
            .attr("class", "artists")
            .attr("cx", 0)
            .attr("cy", (height / 2) - margin.bottom / 2)
            .attr("r", CIRCLE_RADIUS)
            .attr("id", function(d) { return "circle_" + Helper.replaceStringSpace(d.name); })
            .merge(circles)
                .transition()
                .duration(2000)
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })
                .style("fill", function(d) { return "url(#artist_" + Helper.replaceStringSpace(d.name) + ")"; })

        // Show tooltip when hovering over circle (data for respective country)
        d3.selectAll(".artists").on("mousemove", function(d) {
            tooltip.html('<strong>Nom: '+d.name+'</strong><br>Vocabulaire: ' + d.vocab_length + '<br>Sexe: ' + Helper.sexToFrench(d.sexe) + '<br>Type d\'artiste: ' + Helper.artistTypeToFrench(d.artist_type))
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

function computeBeeswarmSimulation(dataSet){
    // Create simulation with specified dataset
    let simulation = d3.forceSimulation(dataSet)
    // Apply positioning force to push nodes towards desired position along X axis
    .force("x", d3.forceX(function(d) {
        // Mapping of values from total/perCapita column of dataset to range of SVG chart (<margin.left, margin.right>)
        return xScale(+d["vocab_length"]);  // This is the desired position
    }).strength(2))  // Increase velocity
    .force("y", d3.forceY((height / 2) - margin.bottom / 2))  // // Apply positioning force to push nodes towards center along Y axis
    .force("collide", d3.forceCollide(EXPLODE_FORCE)) // Apply collision force with radius of 9 - keeps nodes centers 9 pixels apart
    .stop();  // Stop simulation from starting automatically

    // Manually run simulation
    for (let i = 0; i < dataSet.length; ++i) {
        simulation.tick(10);
    }
}

function applyFilter(){
    dataSet.forEach((x)=>{

        if((x.sexe == beeswarmParams.sexe || beeswarmParams.sexe == paramSexe.all) && 
        (x.artist_type == beeswarmParams.artistType || beeswarmParams.artistType == paramArtistType.all) && 
        (x.year == beeswarmParams.year || beeswarmParams.year == paramYear.all)){
            focusArtist(x.name)
        }else{
            hideArtist(x.name)
        }
    })
}

function focusArtist(name){
    d3.select("#circle_" + Helper.replaceStringSpace(name))
        .transition()
        .duration(50)
        .style("fill", "url(#artist_" + Helper.replaceStringSpace(name) + ")")
        .transition()
        .duration(1000)
        .attr("r", CIRCLE_RADIUS)
}

function hideArtist(name){
    d3.select("#circle_" + Helper.replaceStringSpace(name))
        .transition()
        .duration(1000)
        .attr("r", 5)
        .transition()
        .style("fill", null)
}

let elementsArray = document.querySelectorAll(".radio-beeswarm");

elementsArray.forEach(function(elem) {
    elem.addEventListener("input", function(e) {
        switch(e.target.name){
            case "radio-sex":
                beeswarmParams.sexe = e.target.value
                break
            case "radio-artist-type":
                beeswarmParams.artistType = e.target.value
                break
            case "radio-year":
                beeswarmParams.year = e.target.value
                break
        }
        applyFilter();
    });
});

let inputSearch = document.getElementById("input-artist-search")
let proposedArtistsDiv = document.getElementById("proposed-artists-container")
let radioButtons = document.querySelectorAll(".radio-button-beeswarm input[type='radio']")

inputSearch.addEventListener("input", (e)=>{
    let input = e.target.value

    proposedArtistsDiv.innerHTML = ""

    if(input.length == 1){
        radioButtons.forEach((x) =>{
            resetFilter();
            x.disabled = true;
        })
    }
    
    if(input.length == 0){
        radioButtons.forEach((x) =>{
            x.disabled = false;
        })
    }

    dataSet.forEach((x) => {
        let name = x.name.toLowerCase()
        console.log(input);

        if(name.includes(input.toLowerCase())){
            if(input != ""){
                proposedArtistsDiv.innerHTML += "<div class='proposed-artist' onclick='artistClick(this)'>" + x.name + "</div>" 
            }
            focusArtist(x.name)
        }else{
            hideArtist(x.name)
        }
    })
})

function artistClick(e){
    inputSearch.value = e.innerHTML
    inputSearch.dispatchEvent(new Event('input'));
    proposedArtistsDiv.innerHTML = "";
}

function resetFilter(){
    document.getElementById("radio-sex-all").checked = true
    document.getElementById("radio-artist-type-all").checked = true
    document.getElementById("radio-year-all").checked = true

    beeswarmParams.sexe = "All"
    beeswarmParams.artistType = "All"
    beeswarmParams.year = "All"

    applyFilter()
}