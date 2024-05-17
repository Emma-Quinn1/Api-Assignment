import prisma from "../prisma";
import { CreateAlbum, UpdateAlbum } from "../types/album.types";
import { PhotoId } from "../types/photo.types";

export const getAlbums = async (userId: number) => {
	return await prisma.album.findMany({
		where: {
			userId,
		},
	});
};

export const getSingleAlbum = async (albumId: number) => {
	return await prisma.album.findFirst({
		where: {
			id: albumId,
		},
		include: {
			photos: true,
		},
	});
};

export const createAlbum = async (userId: number, data: CreateAlbum) => {
	return await prisma.album.create({
		data: {
			...data,
			userId,
		},
	});
};

export const updateAlbum = async (albumId: number, data: UpdateAlbum) => {
	return await prisma.album.update({
		where: {
			id: albumId,
		},
		data: {
			title: data.title,
		},
	});
};

export const deleteAlbum = async (albumId: number, userId: number) => {
	await prisma.album.update({
		where: {
			id: albumId,
			userId,
		},
		data: {
			photos: {
				set: [],
			},
		},
	});

	return await prisma.album.delete({
		where: {
			id: albumId,
			userId,
		},
	});
};

export const photoToAlbum = async (
	albumId: number,
	photoIds: PhotoId | PhotoId[]
) => {
	return await prisma.album.update({
		where: {
			id: albumId,
		},
		data: {
			photos: {
				connect: photoIds,
			},
		},
	});
};

export const removePhoto = async (albumId: number, photoId: number) => {
	return await prisma.album.update({
		where: {
			id: albumId,
		},
		data: {
			photos: {
				disconnect: {
					id: photoId,
				},
			},
		},
	});
};
