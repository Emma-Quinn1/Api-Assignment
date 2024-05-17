import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateErrors = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		res.status(400).send({
			status: "fail",
			data: validationErrors.array(),
		});
		return;
	}
	next();
};
