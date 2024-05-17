import { Album } from "@prisma/client";

export type CreateAlbum = Omit<Album, "id">;

export type UpdateAlbum = Partial<CreateAlbum>;
