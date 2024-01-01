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
import { UploadApiResponse } from "cloudinary";
import { uploadFile } from "./helpers.controller";

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

export const logOut = async (req: Request, res: Response) => {
	res
		.cookie(env.AUTH_COOKIE, "", {
			httpOnly: true,
			maxAge: 1,
		})
		.redirect("/");
};

export const registerApplicant = async (req: Request, res: Response) => {
	const safe = ValidationSchema.registerApplicant.safeParse(req.fields);
	if (!safe.success) throw new ValidationError(safe.error);

	const safeFiles = ValidationSchema.registerApplicantFile.safeParse(req.files);
	if (!safeFiles.success) throw new ValidationError(safeFiles.error);

	const { cv_resume: cv_file, avatar: avatar_file } = safeFiles.data;

	const {
		password: rawPass,
		address,
		date_of_birth,
		email,
		first_name,
		gender,
		username,
		last_name,
		...applicant_details
	} = safe.data;

	// upload avatr
	const uploadAvFileRes = await uploadFile(avatar_file.path);
	if (uploadAvFileRes.error)
		throw new AppError(
			"An error Occoured",
			resCode.BAD_GATEWAY,
			uploadAvFileRes.error
		);

	const avatar = (uploadAvFileRes as UploadApiResponse).url;

	// upload cv resume
	const uploadCvFileRes = await uploadFile(cv_file.path);
	if (uploadAvFileRes.error)
		throw new AppError(
			"An error Occoured",
			resCode.BAD_GATEWAY,
			uploadAvFileRes.error
		);

	const cv_resume_url = (uploadAvFileRes as UploadApiResponse).url;

	// has password
	const password = bcrypt.hashSync(rawPass, bcrypt.genSaltSync(10));

	//
	const user = await db.user.create({
		data: {
			address,
			date_of_birth,
			email,
			first_name,
			gender,
			last_name,
			password,
			username,
			applicant_details: {
				create: { avatar, cv_resume_url, ...applicant_details },
			},
		},
	});
	return new ApiResponse(res, "Registration successful", {});
};

export const registerEmployer = async (req: Request, res: Response) => {
	return new ApiResponse(res, "register here", {});
};

/* 
const salt = bcrypt.genSaltSync(10);
const pass = bcrypt.hashSync("password", salt);
console.log(pass);
 */
