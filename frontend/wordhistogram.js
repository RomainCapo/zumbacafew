class WordHistogram{
    constructor(data, numberBin){
        this.data = data
        this.numberBin = numberBin
    }

    _getInterval(){
        let values = []
        this.data.forEach(x => {
            values.push(x.value)
        });

        return {"min": Math.min.apply(null, Object.values(values)),
                 "max":Math.max.apply(null, Object.values(values))}
    }

    _computeBin(){
        let minMax = this._getInterval()
        let binWidth = (minMax.max - minMax.min) / this.numberBin;

        let histogramBin = {}

        let binInterval = []
        
        for(let i=minMax.min; i <= minMax.max; i+=binWidth){ binInterval.push(i)}

        this.data.forEach(x => {
            for(let i=0;i<binInterval.length;i++){

                if(x.value > binInterval[i] && x.value < binInterval[i+1]){
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
        /*let bins = this._computeBin()

        for(let i = 0; i < Object.keys(bins).length; i++){
            div.innerHTML = '<div class="col-sm" style="text-align: center;">'
            for(let j; i < Object.keys(bins[i]); j++){

            }
        }*/
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
    }
}

fetch('http://127.0.0.1:8080/word_histogram').then((response) => {
      if (response.status !== 200) {
        return;
      }

      response.json().then(function(data) {
        let wh = new WordHistogram(data, 6)

        let div = document.getElementById("word-histogram")

        wh.computeHistogram(div)
      });
    }
  )

