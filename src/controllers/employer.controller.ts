import { NextFunction, Request, Response } from "express";
import {
	ApiResponse,
	AppError,
	ValidationError,
	resCode,
} from "./response.controller";
import db from "../../prisma";
import ValidationSchema from "../validations/input.validation";
import { z } from "zod";
import { uploadFile } from "./helpers.controller";
import { UploadApiResponse } from "cloudinary";
import { getStringValidation } from "../validations/schema";

export const getEmployerDetails = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const employerDetails = await db.employer.findFirst({
		where: { user: { id: res.locals.user_id } },
		include: {
			_count: { select: { jobs: true } },
			jobs: {
				include: {
					_count: { select: { applications: true } },
					category: true,
				},
				take: 1,
			},
			// applications: {
			// 	take: 1,
			// 	include: { job: { include: { publisher: true, category: true } } },
			// },
		},
	});

	res.locals.employerDetails = employerDetails;
	let apl_count = 0;
	for (let i = 0; i < employerDetails!.jobs.length; i++) {
		apl_count += employerDetails!.jobs[i]._count.applications;
	}
	res.locals.employerDetails.apl_count = apl_count;
	next();
};

export const updatePersonalDetails = async (req: Request, res: Response) => {
	const safe = ValidationSchema.updatePersonalDetails.safeParse(req.fields);
	if (!safe.success) throw new ValidationError(safe.error);

	const id = res.locals.user.id as string;

	const { address, first_name, last_name } = safe.data;

	const updated = await db.user.updateMany({
		where: { id },
		data: { first_name, last_name, address },
	});

	if (!updated) throw new AppError("An error occoured", resCode.NOT_ACCEPTED);

	return new ApiResponse(res, "Personal details updated successfully", {
		updated,
	});
};

export const updateCompanyDetails = async (req: Request, res: Response) => {
	const id = res.locals.user?.id;
	const safe = ValidationSchema.updateCompanyDetails.safeParse(req.fields);
	if (!safe.success) throw new ValidationError(safe.error);

	const data = safe.data;

	const updated = await db.employer.updateMany({
		where: { user: { id } },
		data,
	});
	return new ApiResponse(res, "Company details updated succesfully", {
		updated,
	});
};

export const updateCompanyLogo = async (req: Request, res: Response) => {
	const id = res.locals.user.id as string;

	const safe = z.object({ logo: ValidationSchema.image }).safeParse(req.files);
	if (!safe.success) throw new ValidationError(safe.error);

	const { logo: image } = safe.data;

	const uploadImageRes = await uploadFile(image.path);
	if (uploadImageRes.error)
		throw new AppError(
			"An error Occoured",
			resCode.BAD_GATEWAY,
			uploadImageRes.error
		);

	const company_logo = (uploadImageRes as UploadApiResponse).url;

	const updated = await db.employer.updateMany({
		where: { user: { id } },
		data: { company_logo },
	});

	if (!updated)
		throw new AppError("An error occoured try again", resCode.NOT_ACCEPTED);

	return new ApiResponse(res, "Company logo updated successfully");
};
// res.locals.user_id;
