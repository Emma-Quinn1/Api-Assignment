import Debug from "debug";
import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { CreatePhoto, UpdatePhoto } from "../types/photo.types";
import {
	createPhoto,
	deletePhoto,
	getPhotos,
	getSinglePhoto,
	updatePhoto,
} from "../services/photo_service";

// Create a new debug instance
const debug = Debug("fed23-api-uppgift-1-Emma-Quinn1:photo_controller");

/**
 * Get all photos that belongs to a user
 */
export const index = async (req: Request, res: Response) => {
	try {
		if (!req.token) {
			return res.status(401).send({
				status: "fail",
				message:
					"Uh-oh! Trying to access an authenticated user, but no luck. 😈",
			});
		}

		const userId = req.token.sub;

		const photos = await getPhotos(userId);

		res.status(200).send({
			status: "success",
			data: photos,
		});
	} catch (err: any) {
		if (err.code === "P2025") {
			return res.status(404).send({
				status: "error",
				message: "Photos Not Found",
			});
		}
		res.status(500).send({
			status: "error",
			message:
				"OOPS! We encountered an issue while fetching data from the database",
		});
	}
};

/**
 * Get a single photo
 */
export const show = async (req: Request, res: Response) => {
	try {
		if (!req.token) {
			return res.status(401).send({
				status: "fail",
				message:
					"Uh-oh! Trying to access an authenticated user, but no luck. 😈",
			});
		}

		const photoId = Number(req.params.photoId);

		const userId = req.token.sub;

		const photo = await getSinglePhoto(photoId);

		if (!photo) {
			return res.status(404).send({
				status: "fail",
				message: "Photo not found.",
			});
		}

		if (photo.userId !== userId) {
			return res.status(401).send({
				status: "fail",
				message:
					"Uh-oh! Trying to access a photo that does not belong to you, but no luck. 😈",
			});
		}

		res.status(200).send({
			status: "success",
			data: photo,
		});
	} catch (err: any) {
		debug(err.code);
		res.status(500).send({
			status: "error",
			message:
				"OOPS! We encountered an issue while fetching data from the database",
		});
	}
};

/**
 * Create a photo
 */
export const store = async (req: Request, res: Response) => {
	try {
		if (!req.token) {
			return res.status(401).send({
				status: "fail",
				message:
					"Uh-oh! Trying to access an authenticated user, but no luck. 😈",
			});
		}

		const userId = req.token.sub;
		const validatedData = matchedData(req) as CreatePhoto;
		const photo = await createPhoto(userId, validatedData);

		res.status(201).send({
			status: "success",
			data: {
				title: photo.title,
				url: photo.url,
				comment: photo.comment,
				user_id: photo.userId,
				id: photo.id,
			},
		});
	} catch (err: any) {
		res.status(500).send({
			status: "error",
			message:
				"OOPS! We encountered an issue while fetching data from the database",
		});
	}
};

/**
 * Update a photo
 */
export const update = async (req: Request, res: Response) => {
	try {
		if (!req.token) {
			return res.status(401).send({
				status: "fail",
				message:
					"Uh-oh! Trying to access an authenticated user, but no luck. 😈",
			});
		}

		const photoId = Number(req.params.photoId);
		const userId = req.token.sub;
		const photo = await getSinglePhoto(photoId);

		if (!photo) {
			return res.status(404).send({
				status: "fail",
				message: "Photo not found.",
			});
		}

		if (photo.userId !== userId) {
			return res.status(401).send({
				status: "fail",
				message:
					"Uh-oh! Trying to access a photo that does not belong to you, but no luck. 😈",
			});
		}

		const validatedData = matchedData(req) as UpdatePhoto;
		const updatedPhoto = await updatePhoto(photoId, validatedData);
		debug(validatedData);

		res.status(200).send({
			status: "success",
			data: updatedPhoto,
		});
	} catch (err: any) {
		debug(err);
		res.status(500).send({
			status: "error",
			message:
				"OOPS! We encountered an issue while fetching data from the database",
		});
	}
};

/**
 * Delete a photo
 */
export const destroy = async (req: Request, res: Response) => {
	try {
		if (!req.token) {
			return res.status(401).send({
				status: "fail",
				message:
					"Uh-oh! Trying to access an authenticated user, but no luck. 😈",
			});
		}

		const photoId = Number(req.params.photoId);

		const userId = req.token.sub;
		const photo = await getSinglePhoto(photoId);

		if (!photo) {
			return res.status(404).send({
				status: "fail",
				message: "Photo not found.",
			});
		}

		if (photo.userId !== userId) {
			return res.status(401).send({
				status: "fail",
				message:
					"Uh-oh! Trying to access a photo that does not belong to you, but no luck. 😈",
			});
		}

		await deletePhoto(photoId);

		res.status(200).send({ status: "success", data: null });
	} catch (err: any) {
		res.status(500).send({
			status: "error",
			message:
				"OOPS! We encountered an issue while fetching data from the database",
		});
	}
};
