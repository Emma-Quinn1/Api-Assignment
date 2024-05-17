import express from "express";
import { createUserRules, logInRules } from "../validations/profile_rules";
import {
	login,
	refresh,
	register,
} from "../controllers/authentication_controller";
import { validateErrors } from "../validations/validationErrors";
import { authenticateToken } from "../middlewares/auth/jwt";
import profileRouter from "./profile";
import albumRouter from "./album";
import photoRouter from "./photo";

const router = express.Router();

router.use("/profile", authenticateToken, profileRouter);
router.use("/albums", authenticateToken, albumRouter);
router.use("/photos", authenticateToken, photoRouter);

/**
 * GET /
 */
router.get("/", (req, res) => {
	res.send({
		message:
			"But first, let me take a selfie 🤳 https://www.youtube.com/watch?v=kdemFfbS5H0",
	});
});

/**
 * POST - Register a new user
 */
router.post("/register", createUserRules, validateErrors, register);

/**
 * POST - Login a user
 */
router.post("/login", logInRules, validateErrors, login);

/**
 * POST - Refresh
 */
router.post("/refresh", refresh);

/**
 * Catch-all route handler
 */
router.use((req, res) => {
	// Respond with 404 and a message in JSON-format
	res.status(404).send({
		message: "Not Found",
	});
});

export default router;
