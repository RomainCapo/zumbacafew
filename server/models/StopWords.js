import mongoose from 'mongoose';

const stopWordsSchema = new mongoose.Schema({
    words: [String]
}, { collection: 'stopwords' });

stopWordsSchema.statics.words = () => {
    return StopWords.find({},
        {
            _id: 0,
            words: "$words"
        }
    ).lean().exec();
}

const StopWords = mongoose.model('stopwords', stopWordsSchema);
export default StopWords;