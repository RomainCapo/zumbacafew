import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema({
    name: String,
    image_url: String,
    sexe: String,
    type: String,
    vocab_length: Number,
    vocab_ratio: Number,
    num_songs: Number,
    year_avg: Number,
    vocab: {
        type: Map,
        of: Number
    }
}, { collection: 'artists' });

artistSchema.statics.artistsStats = () => {
    return Artist.find({},
        {
            _id: 0,
            name: "$name",
            image_url: "$image_url",
            gender: "$sexe",
            artist_type: "$type",
            vocab_ratio: "$vocab_ratio",
            year: "$year_avg",
            number_songs: "$num_songs"
        }
    ).lean().exec();
};

artistSchema.statics.vocabulary = () => {
    // https://stackoverflow.com/questions/58137178/how-to-count-word-frequency-in-a-set-of-documents-using-node-js-and-mongoose
    /*return Artist.find({},
        {
            _id: 0,
            vocab: "$vocab"
        }).lean().exec();*/

    /*
            {
            $group: {
                _id: "$words",
                count: { "$sum": 1 }
            }
        },
        { $project: { "_id": 0, "word": "$_id", "count": 1 } },
        { $sort: { "count": -1 } }
    */

    return Artist.aggregate([
        {
            $project: {
                matchWord: { $objectToArray: '$vocab' }
            }
        },
        { $unwind: "$matchWord" },
        {
            $project: {
                _id: "$matchWord.k",
                count: "$matchWord.v"
           }
        },
        {
        $group: {
                _id: "$_id",
                count: { "$sum": "$count" }
            }
        },
        { $sort: { "count": -1 } },
        { $limit: 20 }
    ]);
}

const Artist = mongoose.model('artist', artistSchema);
export default Artist;