import express from "express";
import {
	index,
	show,
	store,
	update,
	destroy,
	addPhotosToAlbum,
	removePhotoFromAlbum,
} from "../controllers/album_controller";
import { validateErrors } from "../validations/validationErrors";
import {
	createAlbumRules,
	paramAlbumRules,
	updateAlbumRules,
} from "../validations/album_rules";
import { paramPhotoRules } from "../validations/photo_rules";

const router = express.Router();

/**
 * GET - Get all albums that belongs to a user
 */
router.get("/", index);

/**
 * GET - Get a single album
 */
router.get("/:albumId", paramAlbumRules, validateErrors, show);

/**
 * POST - Create a new album
 */
router.post("/", createAlbumRules, validateErrors, store);

/**
 * POST - Add photo(s) to an album
 */
router.post("/:albumId/photos", validateErrors, addPhotosToAlbum);

/**
 * PATCH - Update an album
 */
router.patch(
	"/:albumId",
	paramAlbumRules,
	updateAlbumRules,
	validateErrors,
	update
);

/**
 * DELETE - Delete an album and its links
 */
router.delete("/:albumId", paramAlbumRules, validateErrors, destroy);

/**
 * DELETE - Remove a photo from its album
 */

router.delete(
	"/:albumId/photos/:photoId",
	paramAlbumRules,
	paramPhotoRules,
	validateErrors,
	removePhotoFromAlbum
);

export default router;
