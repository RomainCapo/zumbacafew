import Artist from '../models/Artists.js';
import StopWords from '../models/StopWords.js';

export async function allArtists(req, res) {
    res.setHeader('Content-Type', 'application/json');

    try {
        const allArtists = await Artist.allArtists();
        res.json(allArtists);
    } catch (err) {
        console.error(err)
    }
}

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

export async function numberOfWords(req, res) {
    res.setHeader('Content-Type', 'application/json');

    try {
        const numberOfWords = await Artist.numberOfWords();
        res.json(numberOfWords[0]);
    } catch (err) {
        console.error(err)
    }
}

export async function maxYear(req, res) {
    res.setHeader('Content-Type', 'application/json');

    try {
        const maxYear = await Artist.maxYear();
        res.json(maxYear[0]);
    } catch (err) {
        console.error(err)
    }
}

export async function minYear(req, res) {
    res.setHeader('Content-Type', 'application/json');

    try {
        const minYear = await Artist.minYear();
        res.json(minYear[0]);
    } catch (err) {
        console.error(err)
    }
}

export async function termFrequency(req, res) {
    res.setHeader('Content-Type', 'application/json')

    try {
        const ARTIST_NAME = req.params.artistName;

        let termFrequency = await Artist.termFrequency(ARTIST_NAME);
        let stopWords = await StopWords.words();

        stopWords = stopWords[0]['words'];
        termFrequency = termFrequency.filter(term => !stopWords.includes(term['_id']));

        res.json(termFrequency);
    } catch (err) {
        console.error(err)
    }
}

export async function termFrequencyByYear(req, res) {
    res.setHeader('Content-Type', 'application/json')

    try {
        let termFrequencyByYear = await Artist.termFrequencyByYear();
        /*let stopWords = await StopWords.words();

        stopWords = stopWords[0]['words'];
        termFrequency = termFrequency.filter(term => !stopWords.includes(term['_id']));*/

        res.json(termFrequencyByYear);
    } catch (err) {
        console.error(err)
    }
}


