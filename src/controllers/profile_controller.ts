import Debug from "debug";
import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { UpdateUser } from "../types/user.types";
import bcrypt from "bcrypt";
import { findUserById, updateUser } from "../services/profile_service";

// Create a new debug instance
const debug = Debug("fed23-api-uppgift-1-Emma-Quinn1:profile_controller");

/**
 * Get a profile
 */
export const getUserProfile = async (req: Request, res: Response) => {
	try {
		if (!req.token) {
			throw new Error(
				"Uh-oh! Trying to access an authenticated user, but no luck. 😈"
			);
		}

		const userId = req.token.sub;
		const user = await findUserById(userId);

		res.send({
			status: "success",
			data: user,
		});
	} catch (err: any) {
		if (err.code === "P2025") {
			res.status(404).send({
				status: "error",
				message: "User Not Found",
			});
		} else {
			res.status(500).send({
				status: "error",
				message:
					"OOPS! We encountered an issue while fetching data from the database",
			});
		}
	}
};

/**
 * Update a users profile
 */
export const update = async (req: Request, res: Response) => {
	if (!req.token) {
		throw new Error(
			"Uh-oh! Trying to access an authenticated user, but no luck. Was the authentication sneakily removed from this route? 😈"
		);
	}

	const validatedData = matchedData(req) as UpdateUser;
	try {
		if (validatedData.password) {
			validatedData.password = await bcrypt.hash(
				validatedData.password,
				Number(process.env.SALT_ROUNDS) || 10
			);
		}
		const user = await updateUser(req.token.sub, validatedData);
		res.send({
			status: "success",
			data: {
				id: user.id,
				email: user.email,
				first_name: user.first_name,
				last_name: user.last_name,
			},
		});
	} catch (err: any) {
		if (err.code === "P2025") {
			res.status(404).send({
				status: "error",
				message: "User Not Found",
			});
		} else {
			res.status(500).send({
				status: "error",
				message:
					"OOPS! We encountered an issue while fetching data from the database",
			});
		}
	}
};
