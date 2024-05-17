import Debug from "debug";
import { Request, Response } from "express";
import { matchedData } from "express-validator";
import bcrypt from "bcrypt";
import {
	createUser,
	findUserByEmail,
	findUserById,
} from "../services/profile_service";
import { CreateUser } from "../types/user.types";
import { UserJwtPayload, UserJwtRefreshPayload } from "../types/token.types";
import jwt from "jsonwebtoken";

// Create a new debug instance
const debug = Debug("fed23-api-uppgift-1-Emma-Quinn1:user_controller");

interface UserLoginRequest {
	email: string;
	password: string;
}

/**
 * Create a user
 */
export const register = async (req: Request, res: Response) => {
	const validatedData = matchedData(req);
	debug("validatedData: %O", validatedData);

	const hashed_password = await bcrypt.hash(
		validatedData.password,
		Number(process.env.SALT_ROUNDS) || 10
	);

	const data = {
		...validatedData,
		password: hashed_password,
	} as CreateUser;

	try {
		const user = await createUser(data);
		res.status(201).send({
			status: "success",
			data: user,
		});
	} catch (err) {
		debug("Database drama: Error when trying to create User: %O", err);
		return res.status(500).send({
			status: "error",
			message:
				"Looks like our database is playing hard to get, Could not create user",
		});
	}
};

/**
 * Login a user
 */

export const login = async (req: Request, res: Response) => {
	const { email, password }: UserLoginRequest = req.body;

	const user = await findUserByEmail(email);

	if (!user) {
		debug("User %s does not exist", email);
		return res
			.status(401)
			.send({ status: "fail", message: "Authorization required" });
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		debug("User %s password did not match", email);
		return res
			.status(401)
			.send({ status: "fail", message: "Authorization required" });
	}

	const payload: UserJwtPayload = {
		sub: user.id,
		first_name: user.first_name,
		last_name: user.last_name,
		email: user.email,
	};

	if (!process.env.ACCESS_TOKEN_SECRET) {
		debug("ACCESS_TOKEN_SECRET is not defined in the environment");
		return res.status(500).send({
			status: "error",
			message: "Access token is missing",
		});
	}

	const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: process.env.ACCESS_TOKEN_LIFETIME || "2h",
	});

	const refreshPayload: UserJwtRefreshPayload = {
		sub: user.id,
	};

	if (!process.env.REFRESH_TOKEN_SECRET) {
		debug("REFRESH_TOKEN_SECRET is not defined in the environment");
		return res
			.status(500)
			.send({ status: "error", Message: "No refresh token is defined" });
	}

	const refresh_token = jwt.sign(
		refreshPayload,
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: process.env.REFRESH_TOKEN_LIFETIME || "4h",
		}
	);
	res.send({
		status: "success",
		data: {
			access_token,
			refresh_token,
		},
	});
};

export const refresh = async (req: Request, res: Response) => {
	if (!req.headers.authorization) {
		debug("Authorization header missing");
		throw new Error("Authorization header missing");
	}

	debug("Authorization header: %O", req.headers.authorization);
	const [authSchema, refreshToken] = req.headers.authorization.split(" ");

	if (authSchema !== "Bearer") {
		debug("Authorization schema isn't Bearer %s");
		throw new Error(`Expected Bearer authentication`);
	}

	if (!process.env.REFRESH_TOKEN_SECRET) {
		debug("REFRESH_TOKEN_SECRET is not defined in the environment");
		return res.status(500).send({
			status: "error",
			message: "Refresh token is missing",
		});
	}

	try {
		const refreshPayload = jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET
		) as unknown as UserJwtRefreshPayload;

		const user = await findUserById(refreshPayload.sub);

		const payload: UserJwtPayload = {
			sub: user.id,
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
		};

		if (!process.env.ACCESS_TOKEN_SECRET) {
			debug("ACCESS_TOKEN_SECRET is not defined in the environment");
			return res.status(500).send({
				status: "error",
				message: "No access token is defined",
			});
		}
		const access_token = jwt.sign(
			payload,
			process.env.ACCESS_TOKEN_SECRET,
			{
				expiresIn: process.env.ACCESS_TOKEN_LIFETIME || "2h",
			}
		);

		res.send({
			status: "success",
			data: {
				access_token,
			},
		});
	} catch (err) {
		debug("JWT verification failed: %O", err);
		return res
			.status(401)
			.send({ status: "fail", message: "Authorization required" });
	}
};
