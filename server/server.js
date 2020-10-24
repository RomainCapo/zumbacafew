var express = require('express')
var fs = require('fs')

var app = express()

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
        response.push(JSON.parse(fs.readFileSync('..\\artists\\' + dirent.name, 'utf8')))
    }
    dir.closeSync()
    
    res.json(response)
});


app.listen(8080);

