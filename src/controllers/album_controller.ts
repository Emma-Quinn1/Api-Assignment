import Debug from "debug";
import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { CreateAlbum, UpdateAlbum } from "../types/album.types";
import {
	createAlbum,
	deleteAlbum,
	getAlbums,
	getSingleAlbum,
	photoToAlbum,
	removePhoto,
	updateAlbum,
} from "../services/album_service";
import { getSinglePhoto } from "../services/photo_service";
import { Photo } from "@prisma/client";

// Create a new debug instance
const debug = Debug("fed23-api-uppgift-1-Emma-Quinn1:album_controller");

/**
 * Get all the albums that belongs to a user
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
		const albums = await getAlbums(userId);

		res.status(200).send({
			status: "success",
			data: albums,
		});
	} catch (err: any) {
		if (err.code === "P2025") {
			return res.status(404).send({
				status: "error",
				message: "Album Not Found",
			});
		}
		return res.status(500).send({
			status: "error",
			message:
				"OOPS! We encountered an issue while fetching data from the database",
		});
	}
};

/**
 * Get a single album with photos
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

		const albumId = Number(req.params.albumId);
		const userId = req.token.sub;

		const album = await getSingleAlbum(albumId);

		if (!album) {
			return res.status(404).send({
				status: "fail",
				message: "Album not found.",
			});
		}

		if (album.userId !== userId) {
			return res.status(401).send({
				status: "fail",
				message:
					"Uh-oh! Trying to access a album that does not belong to you, but no luck. 😈",
			});
		}

		res.status(200).send({
			status: "success",
			data: album,
		});
	} catch (err: any) {
		debug(err.code);
		return res.status(500).send({
			status: "error",
			message:
				"OOPS! We encountered an issue while fetching data from the database",
		});
	}
};

/**
 * Create a new album
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
		const validatedData = matchedData(req) as CreateAlbum;
		const album = await createAlbum(userId, validatedData);

		res.status(201).send({
			status: "success",
			data: {
				title: album.title,
				user_id: album.userId,
				id: album.id,
			},
		});
	} catch (err: any) {
		return res.status(500).send({
			status: "error",
			message:
				"OOPS! We encountered an issue while fetching data from the database",
		});
	}
};

/**
 * Update an existing album
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

		const albumId = Number(req.params.albumId);
		const userId = req.token.sub;
		const albumExist = await getSingleAlbum(albumId);

		if (!albumExist) {
			return res.status(404).send({
				status: "fail",
				message: "Album not found.",
			});
		}

		if (albumExist.userId !== userId) {
			return res.status(401).send({
				status: "fail",
				message:
					"Uh-oh! Trying to access a album that does not belong to you, but no luck. 😈",
			});
		}

		const validatedData = matchedData(req) as UpdateAlbum;
		const album = await updateAlbum(albumId, validatedData);

		res.status(200).send({
			status: "success",
			data: {
				title: album.title,
				userId: album.userId,
				id: album.id,
			},
		});
	} catch (err: any) {
		debug(err.code);
		return res.status(500).send({
			status: "error",
			message:
				"OOPS! We encountered an issue while fetching data from the database",
		});
	}
};

/**
 * Delete an album and the links to the photos
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

		const albumId = Number(req.params.albumId);
		const userId = req.token.sub;
		const albumExist = await getSingleAlbum(albumId);

		if (!albumExist) {
			return res.status(404).send({
				status: "fail",
				message: "Album not found.",
			});
		}

		if (albumExist.userId !== userId) {
			return res.status(401).send({
				status: "fail",
				message:
					"Uh-oh! Trying to access a album that does not belong to you, but no luck. 😈",
			});
		}

		await deleteAlbum(albumId, req.token.sub);

		res.status(200).send({ status: "success", data: null });
	} catch (err: any) {
		return res.status(500).send({
			status: "error",
			message:
				"OOPS! We encountered an issue while fetching data from the database",
		});
	}
};

/**
 * Adds photos to an album
 */
export const addPhotosToAlbum = async (req: Request, res: Response) => {
	try {
		if (!req.token) {
			return res.status(401).send({
				status: "fail",
				message:
					"Uh-oh! Trying to access an authenticated user, but no luck. 😈",
			});
		}

		const userId = req.token.sub;
		const photos = req.body as Photo[];

		photos.forEach(async (photo: Photo) => {
			const existingPhoto = await getSinglePhoto(photo.id);
			if (!existingPhoto) {
				return res.status(404).send({
					status: "fail",
					message: "Photo not found.",
				});
			}

			if (existingPhoto.userId !== userId) {
				return res.status(401).send({
					status: "fail",
					message:
						"Uh-oh! Trying to access a photo that does not belong to you, but no luck. 😈",
				});
			}
		});

		const albumId = Number(req.params.albumId);
		const album = await getSingleAlbum(albumId);

		if (!album) {
			return res.status(404).send({
				status: "fail",
				message: "Album not found.",
			});
		}

		if (album.userId !== userId) {
			return res.status(401).send({
				status: "fail",
				message:
					"Uh-oh! Trying to access a album that does not belong to you, but no luck. 😈",
			});
		}

		await photoToAlbum(albumId, req.body);

		res.status(200).send({ status: "success", data: null });
	} catch (err) {
		return res.status(500).send({
			status: "error",
			message:
				"OOPS! We encountered an issue while fetching data from the database",
		});
	}
};

/**
 * Remove a photo from an album
 */
export const removePhotoFromAlbum = async (req: Request, res: Response) => {
	try {
		if (!req.token) {
			return res.status(401).send({
				status: "fail",
				message:
					"Uh-oh! Trying to access an authenticated user, but no luck. 😈",
			});
		}

		const albumId = Number(req.params.albumId);
		const photoId = Number(req.params.photoId);

		const userId = req.token.sub;
		const existingPhoto = await getSinglePhoto(photoId);
		if (!existingPhoto) {
			return res.status(404).send({
				status: "fail",
				message: "Photo not found.",
			});
		}

		if (existingPhoto.userId !== userId) {
			return res.status(401).send({
				status: "fail",
				message:
					"Uh-oh! Trying to access a photo that does not belong to you, but no luck. 😈",
			});
		}

		const album = await getSingleAlbum(albumId);

		if (!album) {
			return res.status(404).send({
				status: "fail",
				message: "Album not found.",
			});
		}

		if (album.userId !== userId) {
			return res.status(401).send({
				status: "fail",
				message:
					"Uh-oh! Trying to access a album that does not belong to you, but no luck. 😈",
			});
		}

		await removePhoto(albumId, photoId);
		res.status(200).send({ status: "success", data: null });
	} catch (err: any) {
		return res.status(500).send({
			status: "error",
			message:
				"OOPS! We encountered an issue while fetching data from the database",
		});
	}
};
