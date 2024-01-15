import { NextFunction, Request, Response } from "express";
import db from "../../prisma";
import ValidationSchema from "../validations/input.validation";
import {
	ApiResponse,
	AppError,
	ValidationError,
	resCode,
} from "./response.controller";
import { TUser } from "../types";
import { getNumberValidation } from "../validations/schema";

export const appliyForJob = async (req: Request, res: Response) => {
	const user = res.locals.user as TUser;
	const safe = ValidationSchema.appliyForJob.safeParse(req.fields);
	if (!safe.success) throw new ValidationError(safe.error);
	const { content, job_id: id } = safe.data;

	const job = await db.job.findFirst({
		where: { id },
		select: { applications: true, expires_at: true },
	});

	if (!job) throw new AppError("Job not found", resCode.NOT_FOUND);
	if (job.expires_at < new Date())
		throw new AppError(
			"This job is closed for applications",
			resCode.NOT_ACCEPTED
		);

	const alreadyApplied = [...job.applications].find(
		(app) => app.applicant_id === user.applicant_id
	);

	if (alreadyApplied)
		throw new AppError(
			"You have already applied for this job",
			resCode.CONFLICT
		);

	const application = await db.application.create({
		data: {
			content,
			applicant: { connect: { id: user.applicant_id } },
			job: { connect: { id } },
		},
	});

	if (!application)
		throw new AppError(
			"Application not created",
			resCode.NOT_ACCEPTED,
			application
		);

	return new ApiResponse(
		res,
		"Applied successfully",
		{ application },
		resCode.CREATED
	);
};

export const getUserJobApplications = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// res.locals.user_id;

	const userJobApplications = await db.application.findMany({
		where: { applicant: { user: { id: res.locals.user_id } } },
		include: { job: { include: { publisher: true } } },
	});
	res.locals.userJobApplications = userJobApplications;
	next();
};

export const getJobApplicationDetails = async (req: Request, res: Response) => {
	const id = +req.params.id;
	if (isNaN(id)) throw new AppError("Invalid id", resCode.BAD_REQUEST);

	const application = await db.application.findFirst({
		where: { id },
		include: {
			// applicant: true,
			job: {
				include: {
					category: true,
					publisher: true,
					_count: { select: { applications: true } },
				},
			},
		},
	});

	if (!application) throw new AppError("Not found", resCode.NOT_FOUND);

	return new ApiResponse(res, "Success", { application });
};

export const getApplicationDetails = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const safe = getNumberValidation("id").safeParse(+req.params?.id);
	if (!safe.success) throw new ValidationError(safe.error);

	const id = safe.data;

	const applicationDetails = await db.application.findFirst({
		where: { id },
		include: {
			applicant: {
				include: {
					user: {
						select: {
							last_name: true,
							first_name: true,
							address: true,
							email: true,
						},
					},
				},
			},
			job: {},
		},
	});

	if (!applicationDetails) throw new AppError("Not found", resCode.NOT_FOUND);
	applicationDetails.applicant.qualifications;
	res.locals.applicationDetails = applicationDetails;

	next();
};

export const getApplications = async (req: Request, res: Response) => {
	const id = res.locals.user_id;
	const applications = await db.application.findMany({
		where: { job: { publisher: { user: { id } } } },
		include: {
			job: {},
			applicant: {
				include: {
					user: { select: { email: true, first_name: true, last_name: true } },
				},
			},
		},
	});

	return new ApiResponse(res, "Fetch successful", { applications });
};

export const sendJobInvite = async (req: Request, res: Response) => {
	const safe = getNumberValidation("id").safeParse(+req.params?.id);
	if (!safe.success) throw new ValidationError(safe.error);

	const application_id = safe.data;

	const invited = await db.application.update({
		where: { id: application_id },
		data: { invited: true },
	});

	return new ApiResponse(res, "Successfully invited for interview", {
		invited,
	});
};
