import Artist from '../models/Artists.js';


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
        res.json(termFrequency);
    }
    catch (err) {
        console.error(err)
    }
}