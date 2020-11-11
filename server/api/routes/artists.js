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
    wordByYear,
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
router.get('/termfrequencyByYear', termFrequencyByYear);
router.get('/wordcount', numberOfWords);
router.get('/wordByYear', wordByYear);


export default router;