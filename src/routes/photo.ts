import express from "express";
import {
	index,
	show,
	store,
	update,
	destroy,
} from "../controllers/photo_controller";
import { validateErrors } from "../validations/validationErrors";
import {
	createPhotoRules,
	paramPhotoRules,
	updatePhotoRules,
} from "../validations/photo_rules";
const router = express.Router();

/**
 * GET - Get all photos that belongs to a user
 */
router.get("/", index);

/**
 * GET - Get a single photo
 */
router.get("/:photoId", paramPhotoRules, validateErrors, show);

/**
 * POST - Create a Photo
 */
router.post("/", createPhotoRules, validateErrors, store);

/**
 * PATCH - Update a photo
 */
router.patch(
	"/:photoId",
	paramPhotoRules,
	updatePhotoRules,
	validateErrors,
	update
);

/**
 * DELETE - Delete a photo and the link to the album(s)
 */
router.delete("/:photoId", paramPhotoRules, validateErrors, destroy);

export default router;
