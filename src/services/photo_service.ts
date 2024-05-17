import prisma from "../prisma";
import { CreatePhoto, UpdatePhoto } from "../types/photo.types";

export const getPhotos = async (userId: number) => {
	return await prisma.photo.findMany({
		where: {
			userId,
		},
	});
};

export const getSinglePhoto = async (photoId: number) => {
	return await prisma.photo.findUnique({
		where: {
			id: photoId,
		},
	});
};

export const createPhoto = async (userId: number, data: CreatePhoto) => {
	return await prisma.photo.create({
		data: {
			...data,
			userId,
		},
	});
};

export const updatePhoto = async (photoId: number, data: UpdatePhoto) => {
	return await prisma.photo.update({
		where: {
			id: photoId,
		},
		data: {
			title: data.title,
			url: data.url,
			comment: data.comment,
		},
	});
};

export const deletePhoto = async (photoId: number) => {
	await prisma.photo.update({
		where: {
			id: photoId,
		},
		data: {
			albums: {
				set: [],
			},
		},
	});

	return await prisma.photo.delete({
		where: {
			id: photoId,
		},
	});
};
