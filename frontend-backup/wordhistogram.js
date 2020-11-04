class WordHistogram{
    constructor(data, numberBin){
        this.data = data
        this.numberBin = numberBin

        this.radioButtons = document.querySelectorAll("#word-histogram input[type='radio']")
        this.addEventListnerRadioButtons()
    }

    _getInterval(){
        let values = []
        this.data.forEach(x => {
            values.push(x.vocab_ratio)
        });

        return {"min": Math.floor(Math.min.apply(null, Object.values(values))),
                 "max":Math.ceil(Math.max.apply(null, Object.values(values)))}
    }

    _computeBin(){
        let minMax = this._getInterval()

        let binWidth = Math.round((minMax.max - minMax.min) / this.numberBin)

        let histogramBin = {}

        this.binInterval = []

        let binCounter = Math.floor(minMax.min)
        for(let i = 0;i <= this.numberBin;i++){
            this.binInterval.push(Math.round(binCounter))
            binCounter += binWidth
        }
 
        this.data.forEach(x => {
            for(let i=0;i<=this.binInterval.length;i++){

                if(x.vocab_ratio >= this.binInterval[i] && x.vocab_ratio <= this.binInterval[i+1]){
                    if(typeof(histogramBin[i]) == 'undefined'){
                        histogramBin[i] = []
                    }
                    histogramBin[i].push(x)
                }
            }
        })
        return histogramBin
    }

    computeHistogram(div){
        let bins = this._computeBin()

        let html = ''
        for(let i = 0; i < Object.keys(bins).length; i++){
            html += '<div class="col-sm">'
            bins[i].sort((a, b) => (a.vocab_ratio < b.vocab_ratio) ? 1 : -1) // Sort artist

            for(let j=0; j < Object.keys(bins[i]).length; j++){
                html += '<span id="artist'+ Helper.replaceStringSpace(bins[i][j].name) +'">' + bins[i][j].name + '</span><br>'
            }

            // Legend for each bin
            html += '<hr/><span">'

            if(i == 0){
                html+= '- '+ Helper.round(this.binInterval[i+1]) 
            } else if(i == Object.keys(bins).length-1){
                html += '+ '+Helper.round(this.binInterval[i]) 
            }else{
                html += Helper.round(this.binInterval[i]) +' - '+ Helper.round(this.binInterval[i+1])
            }
            html += '</span></div>'
        }
        div.innerHTML= html

        this.applyFilter("year")
    }

    addEventListnerRadioButtons(){
        this.radioButtons.forEach(elem =>{
            elem.addEventListener("input", x=>{
                this.applyFilter(x.target.value)
            })
        })
    }

    applyFilter(criterion){
        if(criterion != "year"){
            let criterionValues = Array.from(new Set(this.data.map(x => x[criterion])))

            this.data.forEach(x=>{
                let artistSpan = document.getElementById("artist" + Helper.replaceStringSpace(x.name))
                artistSpan.className = "align-bottom c" + criterionValues.indexOf(x[criterion])
            })
            this.updateLegend(criterion, criterionValues)
        }else{
            let criterionValues = Array.from(new Set(this.data.map(x => Helper.ceilYear(x[criterion]))))
            criterionValues.sort()

            this.data.forEach(x=>{
                let artistSpan = document.getElementById("artist" + Helper.replaceStringSpace(x.name))
                artistSpan.className = "align-bottom c" + criterionValues.indexOf(Helper.ceilYear(x[criterion]))
            })
            this.updateLegend(criterion, criterionValues)
        }
    }

    updateLegend(criterion, criterionValues){
        this.legendContainer = document.getElementById("legend-container")
        let html = "<strong>" + Helper.criterionToFrench(criterion) + "</strong>"

        criterionValues.forEach((value, index) => {
            if(criterion == "gender"){
                html += "<div class='c"+ index + "'>"+Helper.sexToFrench(value)+"</div>"
            }else if(criterion == "artist_type"){
                html += "<div class='c"+ index + "'>"+Helper.artistTypeToFrench(value)+"</div>"
            }else{
                html += "<div class='c"+ index + "'>"+value+"</div>"
            }
        })
        this.legendContainer.innerHTML = html
    }
}

fetch('http://localhost:8080/api/artists/stats').then((response) => {
      if (response.status !== 200) {
        return;
      }

      response.json().then(function(data) {

        let wh = new WordHistogram(data,6)

        let div = document.getElementById("word-histogram-chart")

        wh.computeHistogram(div)
      });
    }
  )
