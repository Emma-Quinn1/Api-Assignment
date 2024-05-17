declare global {
	namespace Express {
		export interface Request {
			token?: UserJwtPayload;
		}
	}
}

export type UserJwtPayload = {
	sub: number;
	first_name: string;
	last_name: string;
	email: string;
};

export type UserJwtRefreshPayload = Pick<UserJwtPayload, "sub">;
