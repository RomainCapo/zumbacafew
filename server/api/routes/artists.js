import { Router } from "express";
import { allArtistsVocabulary } from "../../controllers/ArtistController.js";

var router = Router();

router.get("/stats", allArtistsVocabulary);

export default router;