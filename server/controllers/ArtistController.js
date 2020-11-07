import Artist from '../models/Artists.js';
import StopWords from '../models/StopWords.js';


export async function allArtistsVocabulary(req, res) {
    res.setHeader('Content-Type', 'application/json');

    try {
        const artistStats = await Artist.artistsStats();
        res.json(artistStats);
    } catch (err) {
        console.error(err)
    }
}

export async function numberOfArtists(req, res) {
    res.setHeader('Content-Type', 'application/json');

    try {
        const numberOfArtists = await Artist.numberOfAnalyzedArtists();
        res.json({
            count: numberOfArtists
        });
    } catch (err) {
        console.error(err)
    }
}

export async function numberOfSongs(req, res) {
    res.setHeader('Content-Type', 'application/json');

    try {
        const numberOfSongs = await Artist.numberOfSongs();
        res.json(numberOfSongs[0]);
    } catch (err) {
        console.error(err)
    }
}

export async function wordFrequency(req, res) {
    res.setHeader('Content-Type', 'application/json')

    try {
        const artistName = req.params.artistName;

        let termFrequency = await Artist.vocabulary(artistName);
        let stopWords = await StopWords.words();

        stopWords = stopWords[0]['words'];
        termFrequency = termFrequency.filter(term => !stopWords.includes(term['_id']));

        res.json(termFrequency);
    } catch (err) {
        console.error(err)
    }
}