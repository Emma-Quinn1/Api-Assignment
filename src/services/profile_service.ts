import prisma from "../prisma";
import { CreateUser, UpdateUser } from "../types/user.types";

export const findUserByEmail = async (email: string) => {
	return await prisma.user.findUnique({
		where: {
			email,
		},
	});
};

export const findUserById = async (id: number) => {
	return await prisma.user.findUniqueOrThrow({
		where: {
			id,
		},
	});
};

export const createUser = async (data: CreateUser) => {
	return await prisma.user.create({
		data,
	});
};

export const updateUser = async (userId: number, data: UpdateUser) => {
	return prisma.user.update({
		where: {
			id: userId,
		},
		data,
	});
};
