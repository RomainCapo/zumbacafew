import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema({
    name: String,
    image_url: String,
    sexe: String,
    type: String,
    vocab_length: Number,
    vocab_number_unique_word: Number,
    is_complete: Boolean,
    num_songs: Number,
    years: Array,
    vocab: {
        type: Map,
        of: {
            type: Map,
            of: Number
        }
    }
}, {
    collection: 'artists'
});

artistSchema.statics.allArtists = () => {
    return Artist.find({}, {_id: 0, name: 1}).lean().exec();
};

artistSchema.statics.artistsStats = () => {
    return Artist.aggregate([
        {
            $project: {
                _id: 0,
                name: "$name",
                image_url: "$image_url",
                gender: "$sexe",
                artist_type: "$type",
                vocab_length: "$vocab_length",
                vocab_number_unique_word: "$vocab_number_unique_word",
                year: {
                    $round: {
                        $avg : "$years"
                    }
                    },
                is_complete: "$is_complete",
                number_songs: "$num_songs"
            }
        },
    ])
};

artistSchema.statics.numberOfAnalyzedArtists = () => {
    return Artist.find().countDocuments().exec();
}

artistSchema.statics.numberOfSongs = () => {
    return Artist.aggregate([{
            $project: {
                _id: 0,
                numSongs: '$num_songs'
            }
        },
        {
            $group: {
                _id: 0,
                count: {
                    $sum: '$numSongs'
                }
            }
        },
        {
            $project: {
                _id: 0,
                count: '$count'
            }
        }
    ]);
}

artistSchema.statics.vocabulary = (artistName) => {
    let matchStage = {
        $match: {}
    };

    if (typeof artistName !== 'undefined')
        matchStage.$match.name = {
            $regex: new RegExp(artistName, 'i')
        };


    return Artist.aggregate([
        matchStage,
        {
            $project: {
                _id: 0,
                allVocab: {
                    $objectToArray: '$vocab'
                }
            }
        },
        {
            $project: {
                yearVocab: '$allVocab.v'
            }
        },
        {
            $unwind: '$yearVocab'
        },
        {
            $project: {
                matchWord: {
                    $objectToArray: '$yearVocab'
                }
            }
        },
        {
            $unwind: '$matchWord'
        },
        {
            $project: {
                _id: '$matchWord.k',
                count: '$matchWord.v'
            }
        },
        {
            $group: {
                _id: '$_id',
                count: {
                    '$sum': '$count'
                }
            }
        },
        {
            $sort: {
                'count': -1
            }
        },
        {
            $limit: 500
        }
    ]);
}

const Artist = mongoose.model('artist', artistSchema);
export default Artist;