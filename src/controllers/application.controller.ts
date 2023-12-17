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
	).send();
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

export const getApplications = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// res.locals.user_id;
};
