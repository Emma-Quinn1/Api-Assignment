import Debug from "debug";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserJwtPayload } from "../../types/token.types";

const debug = Debug("fed23-api-uppgift-1-Emma-Quinn1:jwt");

export const authenticateToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!req.headers.authorization) {
			debug("Authorization header missing");
			throw new Error("Authorization header missing");
		}

		debug("Authorization header: %O", req.headers.authorization);
		const [authSchema, token] = req.headers.authorization.split(" ");

		if (authSchema !== "Bearer") {
			debug("Authorization schema isn't Bearer %s");
			throw new Error(`Expected Bearer authentication`);
		}

		if (!process.env.ACCESS_TOKEN_SECRET) {
			debug("ACCESS_TOKEN_SECRET is not defined in the environment");
			return res.status(500).send({
				status: "error",
				message: "No access token secret is defined",
			});
		}

		const payload = jwt.verify(
			token,
			process.env.ACCESS_TOKEN_SECRET
		) as unknown as UserJwtPayload;

		req.token = payload;
	} catch (err) {
		return res.status(401).send({
			status: "fail",
			message: "Authorization required",
		});
	}
	next();
};
