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

export function wordFrequency(res, req) {
    // res.setHeader('Content-Type', 'application/json')

    // client.connect().then((client) => {
    //     var db = client.db('zumba_cafew')
    //     var termFreq = {}
    //     db.collection("artists").find().forEach((doc) => {
    //         let voc = doc.vocab
    //         for (const [term, freq] of Object.entries(voc)) {
    //             if (term in termFreq) {
    //                 termFreq[term] += freq
    //             }
    //             else {
    //                 termFreq[term] = freq
    //             }
    //         }
    //     })
    //     console.log(termFreq)
    //     res.json(termFreq)
    // }).catch((error) => {
    //     console.error(error)
    // })
}