        /*'IAM', 
    'jokair', 
    'mcbox', 
    'tsew de kids', 
    'plk', 
    'hamza', 
    'hatik', 
    'zola', 
    'mister v', 
    'gambi', 
    'columbine', 
    'rim'k', 
    'alonzo' 
    'skg', 
    'imen es'
    'Casseurs Flowters'
    1995*/

class WordHistogram{
    constructor(data, numberBin){
        this.data = data
        this.numberBin = numberBin
    }

    _getInterval(){
        let values = []
        this.data.forEach(x => {
            values.push(x.vocab_ratio)
        });

        return {"min": Math.min.apply(null, Object.values(values)),
                 "max":Math.max.apply(null, Object.values(values))}
    }

    _computeBin(){
        let minMax = this._getInterval()
        let binWidth = (minMax.max - minMax.min) / this.numberBin;

        let histogramBin = {}

        this.binInterval = []
        
        for(let i=minMax.min; i <= minMax.max; i+=binWidth){ this.binInterval.push(Math.round(i*100)/100)}
 
        this.data.forEach(x => {
            for(let i=0;i<=this.binInterval.length;i++){

                if(x.vocab_ratio >= this.binInterval[i] && x.vocab_ratio <= this.binInterval[i+1]){
                    if(typeof(histogramBin[i]) == 'undefined'){
                        histogramBin[i] = []
                    }
                    //console.log(x.vocab_ratio);
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
                html += '<span class="align-bottom y'+ Helper.ceilYear(bins[i][j].year) +'">' + bins[i][j].name + '</span><br>'
            }

            html += '<hr/><span>'+ Math.round(this.binInterval[i]*100)/100 +' - '+ Math.round(this.binInterval[i+1]*100)/100 +'</span></div>'
        }
        div.innerHTML= html
    }
}

fetch('http://localhost:8080/api/artists/stats').then((response) => {
      if (response.status !== 200) {
        return;
      }

      response.json().then(function(data) {

        let wh = new WordHistogram(data, 6)

        let div = document.getElementById("word-histogram-chart")

        wh.computeHistogram(div)
      });
    }
  )

