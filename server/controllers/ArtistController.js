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
        const termFrequency = await Artist.vocabulary();
        const stopWords = await StopWords.words();

        // TODO filter stop words
        /*for(let word in stopWords) {
            let stopWord = stopWords[word]['words']
        }*/

        res.json(termFrequency);
    }
    catch (err) {
        console.error(err)
    }
}