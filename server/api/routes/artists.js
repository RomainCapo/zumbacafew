import {
    Router
} from 'express';
import {
    allArtists,
    allArtistsVocabulary,
    maxYear,
    minYear,
    numberOfArtists,
    numberOfSongs,
    numberOfWords,
    termFrequency,
    termFrequencyByYear,
} from '../../controllers/ArtistController.js';

var router = Router();

router.get('/', allArtists)
router.get('/artistcount', numberOfArtists);
router.get('/maxyear', maxYear);
router.get('/minyear', minYear);
router.get('/soundcount', numberOfSongs);
router.get('/stats', allArtistsVocabulary);
router.get('/termfrequency', termFrequency);
router.get('/termfrequency/:artistName', termFrequency);
router.get('/termfrequencyByYear/:word', termFrequencyByYear);
router.get('/wordcount', numberOfWords);


export default router;
