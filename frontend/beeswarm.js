class Beeswarm{
    constructor(svg_element="#svganchor", height=600, width=1200, margin={top: 0, right: 40, bottom: 34, left: 40}, circle_focus_radius=40, circle_hide_radius=5, explode_force=45){
    this.height = height
    this.width = width
    this.margin = margin 
    this.circle_focus_radius = circle_focus_radius
    this.circle_hide_radius = circle_hide_radius
    this.explode_force = explode_force

    this.svg = d3.select(svg_element)
    .append("svg")
    .attr("width", this.width)
    .attr("height", this.height)

    this.svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (this.height - this.margin.bottom) + ")")

    this.xLine = this.svg.append("line")
    .attr("stroke", "rgb(0,0,0)")
    .attr("stroke-dasharray", "10,5");

    this.tooltip = d3.select("#svganchor").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    this.paramGender = {men:"Men", woman:"Woman", all:"All"}
    this.paramArtistType = {individual:"Individual", group:"Group", all:"All"}
    this.paramYear = {y1990:"1990", y2000:"2000", y2010:"2010", y2020:"2020", all:"All"}

    this.beeswarmParams = {}
    this.beeswarmParams.gender = this.paramGender.all
    this.beeswarmParams.artistType = this.paramArtistType.all
    this.beeswarmParams.year = this.paramYear.all

    // Display x axis label
    this.svg.append("text")
    .attr("x", this.width/2)
    .attr("y",  this.height)
    .style("text-anchor", "middle")
    .text("Nombre de mot");

    // Display x axis label
    this.svg.append("text")
    .attr("x", 40)
    .attr("y",  this.height)
    .style("font-size", "10px")
    .style("text-anchor", "left")
    .html("Source: <a href='https://genius.com'>Genius</a>");
    
    this.elementsArray = document.querySelectorAll(".radio-beeswarm");
    this.inputSearch = document.getElementById("input-artist-search")
    this.proposedArtistsDiv = document.getElementById("proposed-artists-container")
    this.radioButtons = document.querySelectorAll(".radio-button-beeswarm input[type='radio']")

    this.addEventListenerRadioButtons()

    this.addEventListenerSearchBar()
    }

    computeChart(){
        d3.json("http://localhost:8080/api/artists/stats").then( data => {
            this.dataSet = data;
            this.xScale = d3.scaleLinear().range([ this.margin.left, this.width - this.margin.right ])

            this.xScale.domain(d3.extent(this.dataSet, function(d) {
                return d["vocab_ratio"]
            }));

            let xAxis = d3.axisBottom(this.xScale).ticks(25).tickSizeOuter(0);

            d3.select(".x.axis").call(xAxis);

            this.computeBeeswarmSimulation(this.xScale)

            // Create country circles
            let circles = this.svg.selectAll(".artists").data(this.dataSet, function(d) { return d; });

            this.dataSet.forEach((d) => {
                this.svg.append("svg:pattern")
                .attr("id", "artist_" + Helper.replaceStringSpace(d.name))
                .attr("width", 1) 
                .attr("height", 1)
                    .append("svg:image")
                    .attr("stroke-width", 0)
                    .attr("xlink:href", d.image_url)
                    .attr("width", this.circle_focus_radius*2)
                    .attr("height", this.circle_focus_radius*2)
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("preserveAspectRatio", "none")
            })

            circles.enter()
            .append("circle")
            .attr("class", "artists")
            .attr("cx", 0)
            .attr("cy", (this.height / 2) - this.margin.bottom / 2)
            .attr("r", this.circle_focus_radius)
            .attr("id", function(d) { return "circle_" + Helper.replaceStringSpace(d.name); })
            .merge(circles)
                .transition()
                .duration(2000)
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })
                .style("fill", function(d) { return "url(#artist_" + Helper.replaceStringSpace(d.name) + ")"; })

            let self = this
            d3.selectAll(".artists").on("mousemove", function(d)  {
                self.tooltip.html('<strong>Nom: '+d.name+'</strong><br>Mot unique par musique: ' + Helper.round(d.vocab_ratio) + '<br>Genre: ' + Helper.sexToFrench(d.gender) + '<br>Type d\'artiste: ' + Helper.artistTypeToFrench(d.artist_type) + '<br>Année: ' + d.year + '<br>Nombre de musique: ' + d.number_songs)
                .style('top', d3.event.pageY - 12 + 'px')
                .style('left', d3.event.pageX + 25 + 'px')
                .style("opacity", 0.9);

                self.xLine.attr("x1", d3.select(this).attr("cx"))
                .attr("y1", d3.select(this).attr("cy"))
                .attr("y2", (self.height - self.margin.bottom))
                .attr("x2",  d3.select(this).attr("cx"))
                .attr("opacity", 1);

            }).on("mouseout", _ => {
                self.tooltip.style("opacity", 0);
                self.xLine.attr("opacity", 0);
            });
        })
    }

    computeBeeswarmSimulation(xscale){

        // Create simulation with specified dataset
        let simulation = d3.forceSimulation(this.dataSet)
        // Apply positioning force to push nodes towards desired position along X axis
        .force("x", d3.forceX(function(d) {
            // Mapping of values from total/perCapita column of dataset to range of SVG chart (<margin.left, margin.right>)
            return xscale(+d["vocab_ratio"]);  // This is the desired position
        }).strength(2))  // Increase velocity
        .force("y", d3.forceY((this.height / 2) - this.margin.bottom / 2))  // // Apply positioning force to push nodes towards center along Y axis
        .force("collide", d3.forceCollide(this.explode_force)) // Apply collision force with radius of 9 - keeps nodes centers 9 pixels apart
        .stop();  // Stop simulation from starting automatically
    
        // Manually run simulation
        for (let i = 0; i < this.dataSet.length; ++i) {
            simulation.tick(10);
        }
    }

    applyFilter(){
        this.dataSet.forEach(x =>{
            if((x.gender == this.beeswarmParams.gender || this.beeswarmParams.gender == this.paramGender.all) && 
            (x.artist_type == this.beeswarmParams.artistType || this.beeswarmParams.artistType == this.paramArtistType.all) && 
            (Helper.ceilYear(x.year) == this.beeswarmParams.year || this.beeswarmParams.year == this.paramYear.all)){
                this.focusArtist(x.name)
            }else{
                this.hideArtist(x.name)
            }
        })
    }

    focusArtist(name){
        d3.select("#circle_" + Helper.replaceStringSpace(name))
            .transition()
            .duration(50)
            .style("fill", "url(#artist_" + Helper.replaceStringSpace(name) + ")")
            .transition()
            .duration(1000)
            .attr("r", this.circle_focus_radius)
    }
    
    hideArtist(name){
        d3.select("#circle_" + Helper.replaceStringSpace(name))
            .transition()
            .duration(1000)
            .attr("r", this.circle_hide_radius)
            .transition()
            .style("fill", null)
    }

    addEventListenerSearchBar(){
        this.inputSearch.addEventListener("input", e =>{
            let input = e.target.value
        
            this.proposedArtistsDiv.innerHTML = ""
        
            if(input.length == 1){
                this.radioButtons.forEach(x =>{
                    this.resetFilter();
                    x.disabled = true;
                })
            }
            
            if(input.length == 0){
                this.radioButtons.forEach(x =>{
                    x.disabled = false;
                })
            }
        
            this.dataSet.forEach(x => {
                let name = x.name.toLowerCase()
        
                if(name.includes(input.toLowerCase())){
                    if(input != ""){
                        this.proposedArtistsDiv.innerHTML += "<div class='proposed-artist' onclick='Beeswarm.artistClick(this)'>" + x.name + "</div>" 
                    }
                    this.focusArtist(x.name)
                }else{
                    this.hideArtist(x.name)
                }
            })
        })
    }

    addEventListenerRadioButtons(){
        this.elementsArray.forEach(elem => {
            elem.addEventListener("input", e => {
                switch(e.target.name){
                    case "radio-sex":
                        this.beeswarmParams.gender = e.target.value
                        break
                    case "radio-artist-type":
                        this.beeswarmParams.artistType = e.target.value
                        break
                    case "radio-year":
                        this.beeswarmParams.year = e.target.value
                        break
                }
                this.applyFilter();
                });
            });
    }
    
    resetFilter(){
        document.getElementById("radio-sex-all").checked = true
        document.getElementById("radio-artist-type-all").checked = true
        document.getElementById("radio-year-all").checked = true
    
        this.beeswarmParams.gender = "All"
        this.beeswarmParams.artistType = "All"
        this.beeswarmParams.year = "All"
    
        this.applyFilter()
    }

    static artistClick(e){
        let inputSearch = document.getElementById("input-artist-search")

        inputSearch.value = e.innerHTML
        inputSearch.dispatchEvent(new Event('input'));
        document.getElementById("proposed-artists-container").innerHTML = "";
    }
}

let b = new Beeswarm()
b.computeChart();