import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AppError, resCode } from "./response.controller";
import jwt from "jsonwebtoken";
import env from "../../env";
import { hasExpired, isValidToken } from "./helpers.controller";
import db from "../../prisma";
import { TUser } from "../types";

export const onlyApplicants = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user = res.locals.user as TUser;

	if (!user.is_applicant) throw new AppError("Forbidden", resCode.FORBIDDEN);

	next();
};

export const onlyEmployers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user = res.locals.user as TUser;

	if (user.is_applicant) throw new AppError("Forbidden", resCode.FORBIDDEN);

	next();
};

export const onlyUsers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const isValid = z.object({ authed: z.string() }).safeParse(req.cookies);

	if (!isValid.success)
		throw new AppError("Not logged in", resCode.UNAUTHORIZED);

	// const providedToken = isValid.data.authed.split(" ")?.[1]?.trim();
	const providedToken = isValid.data.authed;

	if (!providedToken)
		throw new AppError("Invalid API key", resCode.UNAUTHORIZED);

	const veriedToken: unknown = jwt.verify(providedToken, env.HASH_SECRET);

	if (!isValidToken(veriedToken))
		throw new AppError("Invalid API key", resCode.UNAUTHORIZED);

	const { id, exp } = veriedToken;

	if (exp && hasExpired(exp))
		throw new AppError("API key has expired", resCode.UNAUTHORIZED);
	const user = await db.user.findFirst({ where: { id } });

	if (!user) throw new AppError("Invalid user", resCode.UNAUTHORIZED);

	res.locals.user = user;

	next();
};
