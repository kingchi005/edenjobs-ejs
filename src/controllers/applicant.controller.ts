import { NextFunction, Request, Response } from "express";
import db from "../../prisma";
import ValidationSchema from "../validations/input.validation";
import {
	ApiResponse,
	AppError,
	ValidationError,
	resCode,
} from "./response.controller";

export const getApplicantDetails = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// res.locals.user_id;

	const applicantDetails = await db.applicant.findFirst({
		where: { user: { id: res.locals.user_id } },
		include: { _count: { select: { applications: true } } },
	});

	res.locals.applicantDetails = applicantDetails;
	next();
};

export const updateWorkDetails = async (req: Request, res: Response) => {
	const safe = ValidationSchema.updateWorkDetails.safeParse(req.fields);
	if (!safe.success) throw new ValidationError(safe.error);

	const id = res.locals.user.id as string;
	const { qualifications: qualArr, skill_set: skillArr, ...data } = safe.data;
	const qualifications = JSON.stringify(qualArr);
	const skill_set = JSON.stringify(skillArr);
	const updated = await db.applicant.updateMany({
		where: { user: { id } },
		data: { ...data, qualifications, skill_set },
	});

	if (!updated) throw new AppError("An error occoured", resCode.NOT_ACCEPTED);

	return new ApiResponse(res, "Work details updated successfully", { updated });
};

export const updateJobPreferences = async (req: Request, res: Response) => {
	const safe = ValidationSchema.updateJobPreferences.safeParse(req.fields);
	if (!safe.success) throw new ValidationError(safe.error);

	const id = res.locals.user.id as string;
	const {
		Job_location: location_type,
		job_type: preferred_job_type,
		work_schedule,
	} = safe.data;

	const updated = await db.applicant.updateMany({
		where: { user: { id } },
		data: { preferred_job_type, location_type, work_schedule },
	});

	if (!updated) throw new AppError("An error occoured", resCode.NOT_ACCEPTED);

	return new ApiResponse(res, "Job preferences updated successfully", {
		updated,
	});
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
