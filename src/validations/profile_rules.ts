import { body } from "express-validator";
import { findUserByEmail } from "../services/profile_service";

export const createUserRules = [
	body("first_name")
		.isString()
		.withMessage("Firstname has to ba a sting")
		.bail()
		.trim()
		.isLength({ min: 3 })
		.withMessage("Firstname must be at least 3 characters long"),

	body("last_name")
		.isString()
		.withMessage("Lastname has to ba a sting")
		.bail()
		.trim()
		.isLength({ min: 3 })
		.withMessage("Lastname must be at least 3 characters long"),

	body("email")
		.isEmail()
		.withMessage("Email has to be a valid email")
		.bail()
		.trim()
		.custom(async (value) => {
			const user = await findUserByEmail(value);
			if (user) {
				throw new Error("Email already exists");
			}
		}),

	body("password")
		.isString()
		.withMessage("Password has to be a string")
		.bail()
		.isLength({ min: 6 })
		.withMessage("Password has to be at least 6 characters long"),
];

export const logInRules = [
	body("email")
		.notEmpty()
		.withMessage("Email can not be empty")
		.bail()
		.isEmail()
		.withMessage("Email has to be an email")
		.custom(async (value) => {
			const user = await findUserByEmail(value);
			if (!user) {
				throw new Error("Email must exist");
			}
		})
		.trim(),

	body("password")
		.notEmpty()
		.isString()
		.withMessage("Password can not be empty")
		.bail()
		.isLength({ min: 6 })
		.withMessage("Password has to be at least 6 characters long"),
];

export const updateUserRules = [
	body("first_name")
		.optional()
		.isString()
		.withMessage("Firstname has to be a string")
		.bail()
		.trim()
		.isLength({ min: 3 })
		.withMessage("Firstname must be at least 3 characters long"),

	body("last_name")
		.optional()
		.isString()
		.withMessage("Lastname has to be a string")
		.bail()
		.trim()
		.isLength({ min: 3 })
		.withMessage("Lastname must be at least 3 characters long"),

	body("email")
		.optional()
		.isEmail()
		.withMessage("Email has to be an email")
		.bail()
		.custom(async (value) => {
			const user = await findUserByEmail(value);
			if (user) {
				throw new Error("Email already exist, must be unique");
			}
		})
		.trim(),

	body("password")
		.optional()
		.isString()
		.withMessage("Password has to be a string")
		.bail()
		.trim()
		.isLength({ min: 6 })
		.withMessage("Password has to be at least 6 characters long"),
];
