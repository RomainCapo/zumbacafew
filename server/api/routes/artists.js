import {
    Router
} from 'express';
import {
    allArtistsVocabulary,
    numberOfArtists,
    numberOfSongs,
    wordFrequency
} from '../../controllers/ArtistController.js';

var router = Router();

router.get('/artistcount', numberOfArtists);
router.get('/stats', allArtistsVocabulary);
router.get('/soundcount', numberOfSongs);
router.get('/termfrequency', wordFrequency);
router.get('/termfrequency/:artistName', wordFrequency);

export default router;