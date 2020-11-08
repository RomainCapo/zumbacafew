import {
    Router
} from 'express';
import {
    allArtists,
    allArtistsVocabulary,
    numberOfArtists,
    numberOfSongs,
    wordFrequency,
    numberOfWords,
    minYear,
    maxYear
} from '../../controllers/ArtistController.js';

var router = Router();

router.get('/', allArtists)
router.get('/artistcount', numberOfArtists);
router.get('/stats', allArtistsVocabulary);
router.get('/soundcount', numberOfSongs);
router.get('/wordcount', numberOfWords);
router.get('/termfrequency', wordFrequency);
router.get('/minyear', minYear)
router.get('/maxyear', maxYear);
router.get('/termfrequency/:artistName', wordFrequency);

export default router;