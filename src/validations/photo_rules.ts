import { body, param } from "express-validator";

export const createPhotoRules = [
	body("title")
		.isString()
		.withMessage("Title has to be a string")
		.bail()
		.trim()
		.isLength({ min: 3 })
		.withMessage("Title has to be at least 3 characters long"),

	body("url")
		.isURL()
		.withMessage("URL has to be a string and a valid URL")
		.bail()
		.trim(),

	body("comment")
		.optional()
		.isString()
		.withMessage("Comment has to be a string")
		.bail()
		.trim()
		.isLength({ min: 3 })
		.withMessage("Comment has to be at least 3 characters long"),
];

export const updatePhotoRules = [
	body("title")
		.isString()
		.withMessage("Title has to be a string")
		.bail()
		.trim()
		.isLength({ min: 3 })
		.withMessage("Title has to be at least 3 characters long"),

	body("url")
		.optional()
		.isURL()
		.withMessage("URL has to be a string and a valid URL")
		.bail()
		.trim(),

	body("comment")
		.optional()
		.isString()
		.withMessage("Comment has to be a string")
		.bail()
		.trim()
		.isLength({ min: 3 })
		.withMessage("Comment has to be at least 3 characters long"),
];

export const paramPhotoRules = [
	param("photoId")
		.notEmpty()
		.isNumeric()
		.withMessage("PhotoId has to be an integer")
		.bail(),
];
