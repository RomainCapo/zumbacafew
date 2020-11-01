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

const Artist = mongoose.model('artist', artistSchema);
export default Artist;