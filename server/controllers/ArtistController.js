import Artist from '../models/Artists.js';
import StopWords from '../models/StopWords.js';


export async function allArtistsVocabulary(req, res) {
    res.setHeader('Content-Type', 'application/json');

    try {
        const artistStats = await Artist.artistsStats();
        res.json(artistStats);
    }
    catch (err) {
        console.error(err)
    }
}

export async function wordFrequency(req, res) {
    res.setHeader('Content-Type', 'application/json')

    try {
        let termFrequency = await Artist.vocabulary();
        let stopWords = await StopWords.words();

        stopWords = stopWords[0]["words"];
        termFrequency = termFrequency.filter(term => !stopWords.includes(term["_id"]));

        res.json(termFrequency);
    }
    catch (err) {
        console.error(err)
    }
}