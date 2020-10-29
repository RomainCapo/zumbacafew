var express = require('express')
var fs = require('fs')
var cors = require('cors') // for local dev only

var app = express()
app.use(cors())// for local dev only

function ceilYear(year){
    let yearStr = year.toString()
    yearStr = yearStr.slice(0, -1) + "0"
    return parseInt(yearStr)
}

app.get('/artist/:artist_name', function(req, res) {
    try {
        var json = JSON.parse(fs.readFileSync('..\\artists\\' + req.params.artist_name + '.json', 'utf8'))
        res.setHeader('Content-Type', 'application/json')
        res.json(json)
    } catch (error) {
        res.setHeader('Content-Type', 'text/plain')
        res.send(error)
    }
});

app.get('/all_artists', function(req, res) {
    const dir = fs.opendirSync('..\\artists')
    let dirent

    let response = [];

    while ((dirent = dir.readSync()) !== null) {
        let artist = JSON.parse(fs.readFileSync('..\\artists\\' + dirent.name, 'utf8'))
        response.push({"name" : artist.name, 
                        "image_url" : artist.image_url,
                        "vocab_ratio" : artist.vocab_ratio,
                        "gender" : artist.sexe,
                        "artist_type":artist.type,
                        "year":ceilYear(artist.year_avg),
                        "number_songs":artist.num_songs})
    }
    dir.closeSync()
    
    res.setHeader('Content-Type', 'application/json')
    res.json(response)
});

app.listen(8080);

