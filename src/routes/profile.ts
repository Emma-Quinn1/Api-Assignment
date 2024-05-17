import express from "express";
import { update, getUserProfile } from "../controllers/profile_controller";
import { updateUserRules } from "../validations/profile_rules";
import { validateErrors } from "../validations/validationErrors";
const router = express.Router();

/**
 * GET - Authenticated profile
 */
router.get("/", getUserProfile);

/**
 * PATCH - Update a users profile
 */
router.patch("/", updateUserRules, validateErrors, update);

export default router;
