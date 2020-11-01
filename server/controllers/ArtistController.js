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
        console.log(termFrequency);
        /*
        let termFrequency = new Map();
        for(let artistVoc of vocabulary) {
            for(let term in artistVoc['vocab']) {
                let freq = artistVoc['vocab'][term]
                if (termFrequency.has(term)) {
                    termFrequency.set(term, termFrequency.get(term) + freq);
                }
                else {
                    termFrequency.set(term, freq);
                }
            }
        }*/

        res.json(termFrequency);
    }
    catch (err) {
        console.error(err)
    }
}