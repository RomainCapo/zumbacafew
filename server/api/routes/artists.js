import {
    Router
} from "express";
import {
    allArtistsVocabulary,
    wordFrequency
} from "../../controllers/ArtistController.js";

var router = Router();

router.get("/stats", allArtistsVocabulary);
router.get("/termfrequency", wordFrequency);

export default router;