import { Request, Response } from "express";
import {
	ApiResponse,
	AppError,
	ValidationError,
	resCode,
} from "./response.controller";
import ValidationSchema from "../validations/input.validation";
import db from "../../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../../env";

export const loginUser = async (req: Request, res: Response) => {
	const safe = ValidationSchema.login.safeParse(req.fields);
	if (!safe.success) throw new ValidationError(safe.error);
	const { identifier, password: rawPass } = safe.data;

	const _user = await db.user.findFirst({
		where: { OR: [{ username: identifier }, { email: identifier }] },
		include: { applicant_details: true, employer_details: true },
	});
	if (!_user)
		throw new AppError("Incorrect email or username", resCode.UNAUTHORIZED);

	// verify password

	const authorised = bcrypt.compareSync(rawPass, _user.password);
	if (!authorised)
		throw new AppError("Incorrect password", resCode.UNAUTHORIZED);

	// set cookies
	const token = jwt.sign(
		{ id: _user.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 },
		env.HASH_SECRET + ""
	);
	res.cookie(env.AUTH_COOKIE, token, {
		httpOnly: true,
		maxAge: 1 * 24 * 60 * 60 * 1000,
	});

	res.locals.user = _user;
	const { password, ...user } = _user;

	return new ApiResponse(res, "login here", { user });
};

// export const registerUser = async (req: Request, res: Response) => {
// 	const safe = ValidationSchema.registerApplicant.safeParse(req.fields);
// 	if (!safe.success) throw new ValidationError(safe.error);
// 	const { password: rawPass, ...data } = safe.data;

// 	// hash Password

// 	const salt = bcrypt.genSaltSync(10);
// 	const password = await bcrypt.hashSync(rawPass, salt);

// 	const user = await db.user.create({
// 		data: { ...data, password },
// 	});
// 	return new ApiResponse(res, "register user here", {});
// };

export const logOut = async (req: Request, res: Response) => {
	res
		.cookie(env.AUTH_COOKIE, "", {
			httpOnly: true,
			maxAge: 1,
		})
		.redirect("/");
};

export const registerApplicant = async (req: Request, res: Response) => {
	return new ApiResponse(res, "register here", {});
};

export const registerEmployer = async (req: Request, res: Response) => {
	return new ApiResponse(res, "register here", {});
};

/* 
const salt = bcrypt.genSaltSync(10);
const pass = bcrypt.hashSync("password", salt);
console.log(pass);
 */
