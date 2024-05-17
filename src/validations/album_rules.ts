import { body, param } from "express-validator";
import { findPhotoById } from "../services/album_service";

export const createAlbumRules = [
	body("title")
		.isString()
		.withMessage("Title has to be a string")
		.bail()
		.trim()
		.isLength({ min: 3 })
		.withMessage("Title has to be at least 3 characters long"),
];

export const updateAlbumRules = [
	body("title")
		.isString()
		.withMessage("Title has to be a string")
		.bail()
		.trim()
		.isLength({ min: 3 })
		.withMessage("Title has to be at least 3 characters long"),
];

export const paramAlbumRules = [
	param("albumId")
		.notEmpty()
		.isNumeric()
		.withMessage("AlbumId has to be an integer")
		.bail(),
];
