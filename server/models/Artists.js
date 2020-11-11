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
    vocab: [{
        year: Number,
        words: [{
            word: String,
            count: Number
        }]
    }]
}, {
    collection: 'artists'
});

artistSchema.statics.allArtists = () => {
    return Artist.find({}, {
        _id: 0,
        name: 1
    }).lean().exec();
};

artistSchema.statics.artistsStats = () => {
    return Artist.aggregate([{
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
                    $avg: "$years"
                }
            },
            is_complete: "$is_complete",
            number_songs: "$num_songs"
        }
    }, ])
};

artistSchema.statics.numberOfAnalyzedArtists = () => {
    return Artist.find().countDocuments().exec();
}

artistSchema.statics.numberOfWords = () => {
    return Artist.aggregate([{
            $project: {
                _id: 0,
                vocabLength: '$vocab_length'
            }
        },
        {
            $group: {
                _id: 0,
                count: {
                    $sum: '$vocabLength'
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

artistSchema.statics.maxYear = () => {
    return Artist.aggregate([{
            $project: {
                _id: 0,
                year: '$years'
            }
        },
        {
            $group: {
                _id: 0,
                maxByArtist: {
                    $max: '$year'
                }
            }
        },
        {
            $project: {
                _id: 0,
                max: {
                    $max: '$maxByArtist'
                }
            }
        }
    ]);
}

artistSchema.statics.minYear = () => {
    return Artist.aggregate([{
            $project: {
                _id: 0,
                year: '$years'
            }
        },
        {
            $group: {
                _id: 0,
                minByArtist: {
                    $min: '$year'
                }
            }
        },
        {
            $project: {
                _id: 0,
                min: {
                    $min: '$minByArtist'
                }
            }
        }
    ]);
}

artistSchema.statics.termFrequency = (artistName) => {
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
                vocab: "$vocab.words"
            }
        },
        {
            $unwind: "$vocab"
        },
        {
            $unwind: "$vocab"
        },
        {
            $group: {
                _id: "$vocab.word",
                count: {
                    $sum: "$vocab.count"
                }
            }
        },
        {
            $sort: {
                count: -1
            }
        },
        {
            $limit: 500
        }
    ])
}

artistSchema.statics.termFrequencyByYear = () => {
    return Artist.aggregate([{
            $project: {
                _id: 0,
                vocab: "$vocab"
            }
        },
        {
            $unwind: "$vocab"
        },
        {
            $unwind: "$vocab.words"
        },
        {
            $group: {
                _id: {
                    year: "$vocab.year",
                    word: "$vocab.words.word"
                },
                count: {
                    $sum: "$vocab.words.count"
                }
            }
        }
    ])
}

artistSchema.statics.wordByYear = () => {
    return Artist.aggregate([
        {
            $project: {
                _id: 0,
                vocab: "$vocab"
            }
        },
        {
            $unwind: "$vocab"
        },
        {
            $unwind: "$vocab.words"
        },
        {
            $group: {
                _id: {
                    year: "$vocab.year",
                    word: "$vocab.words.word"
                },
                count: {
                    $sum: "$vocab.words.count"
                }
            }
        },
        {
            $limit: 50
        }
    ])
}

const Artist = mongoose.model('artist', artistSchema);
export default Artist;