var express = require('express')
var fs = require('fs')
var cors = require('cors') // for local dev only
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://db:27017/";

const client = new MongoClient(url, { useUnifiedTopology: true });

var app = express()
app.use(cors())// for local dev only

app.get('/all_artists', function (req, res) {
    res.setHeader('Content-Type', 'application/json')

    client.connect().then((client) => {
        var db = client.db('zumba_cafew')
        db.collection("artists").find({}, {
            projection: {
                _id: 0,
                name: 1,
                image_url: 1,
                gender: "$sexe",
                artist_type: "$type",
                vocab_ratio: 1,
                year: "$year_avg",
                number_songs: "$num_songs"
            }
        }).toArray(function (err, result) {
            res.json(result)
            
        })
    }).catch((error) => {
        console.error(error)
    })
})

app.listen(8080);

