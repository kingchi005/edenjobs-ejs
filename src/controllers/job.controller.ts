import { NextFunction, Request, Response } from "express";
import {
	ApiResponse,
	AppError,
	ValidationError,
	resCode,
} from "./response.controller";
import db from "../../prisma";
import { z } from "zod";
import {
	getBooleanValidation,
	getNumberValidation,
	getOptionalStringValidation,
	getStringValidation,
} from "../validations/schema";
import { Validation } from "../../public/tw-elements/src/js/index.es";
import ValidationSchema from "../validations/input.validation";

const NO_PER_PAGE = 8;
export const creatJob = async (req: Request, res: Response) => {
	const publisher_id = res.locals.user.employer_details.id as string;
	const safe = ValidationSchema.createJob.safeParse(req.fields);
	if (!safe.success) throw new ValidationError(safe.error);

	const { job_location, ...data } = safe.data;
	const is_remote = job_location === "Remote";

	const createdJob = await db.job.create({
		data: {
			...data,
			publisher_id,
			is_remote,
		},
	});

	if (!createdJob)
		throw new AppError("An Error occoured", resCode.NOT_ACCEPTED, {
			createdJob,
		});

	return new ApiResponse(res, "Job Created successfully", { createdJob });
};

export const editJob = async (req: Request, res: Response) => {
	const safeParam = z
		.object({ id: getStringValidation("id") })
		.safeParse(req.params);

	if (!safeParam.success) throw new ValidationError(safeParam.error);
	const { id: job_id } = safeParam.data;

	const safe = ValidationSchema.editJob.safeParse(req.fields);
	if (!safe.success) throw new ValidationError(safe.error);

	const { job_location, ...data } = safe.data;
	const is_remote = job_location === "Remote";

	const editedJob = await db.job.update({
		where: { id: job_id },
		data: {
			...data,

			is_remote,
		},
	});

	if (!editedJob)
		throw new AppError("An Error occoured", resCode.NOT_ACCEPTED, {
			editedJob,
		});

	return new ApiResponse(res, "Job Updated successfully", { editedJob });
};

export const deleteJob = async (req: Request, res: Response) => {
	const safe = z
		.object({ id: getStringValidation("id") })
		.safeParse(req.params);
	if (!safe.success) throw new ValidationError(safe.error);

	const { id } = safe.data;
	const deletedJob = await db.job.delete({ where: { id } });

	if (!deleteJob) throw new AppError("Not found", resCode.NOT_FOUND, deleteJob);

	return new ApiResponse(res, `Job deleted `, { deletedJob });
};

export const getJobs = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const jobs = await db.job.findMany({
		take: NO_PER_PAGE,
		include: {
			_count: { select: { applications: true } },
			publisher: true,
			category: true,
		},
	});
	res.locals.jobs = jobs;
	next();
};

export const getJobDetail = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const job = await db.job.findFirst({
		where: { id: req.params.id },
		include: {
			_count: { select: { applications: true } },
			publisher: true,
			category: true,
			applications: true,
		},
	});
	res.locals.job = job;
	next();
};

export const getRecentJobs = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const recentJobs = await db.job.findMany({
		orderBy: { published_at: "asc" },
		take: 10,
		include: {
			_count: { select: { applications: true } },
			publisher: true,
			category: true,
		},
	});
	res.locals.recentJobs = recentJobs;

	next();
};

export const getRecomendedJobs = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const jobs = await db.job.findMany({
		take: 5,
		include: {
			_count: { select: { applications: true } },
			publisher: true,
			category: true,
		},
	});
	res.locals.recommendedJobs = jobs;
	next();
};

export const searchJobs = async (req: Request, res: Response) => {
	const page = +(req.query.page || 1);
	const skip = (page - 1) * NO_PER_PAGE;

	let where: any = {
		AND: [
			{
				OR: [
					{ title: { contains: req.query.search_word || "" } },
					{ summary: { contains: req.query.search_word || "" } },
				],
			},
		],
	};

	if (req.query.category_id) {
		where.AND.push({ category_id: +req.query.category_id });
	}
	if (req.query.min_salary) {
		where.AND.push({ max_salary: { gte: +req.query.min_salary || 100 } });
	}
	if (req.query.remote) {
		where.AND.push({ is_remote: !!+req.query.remote });
	}
	const jobs = await db.job.findMany({
		where,
		// take: NO_PER_PAGE,
		// skip,
		include: {
			publisher: true,
			category: true,
			_count: { select: { applications: true } },
		},
	});

	if (!jobs) return new ApiResponse(res, "No jobs found", {});

	// const current_jobs_count = jobs.length || 0;
	// const total_jobs_count = jobs || 0;
	// const remainning_jobs_count =
	// 	current_jobs_count < NO_PER_PAGE ? 0 : total_jobs_count - page * NO_PER_PAGE;
	// const nextPage = !!remainning_jobs_count;

	return new ApiResponse(res, "success", { jobs });
};

export const getJobCategory = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const jobCategories = await db.jobCategory.findMany();
	res.locals.jobCategories = jobCategories;
	next();
};

export const getLatestJobApplications = async (req: Request, res: Response) => {
	const safe = z
		.object({ id: getStringValidation("id") })
		.safeParse(req.params);

	if (!safe.success) throw new ValidationError(safe.error);

	const id = safe.data.id;

	const latestJobApplications = await db.job.findFirst({
		where: { id },
		select: {
			applications: {
				include: {
					applicant: {
						select: {
							avatar: true,
							user: {
								select: { first_name: true, last_name: true, email: true },
							},
						},
					},
				},
			},
		},
	});

	if (!latestJobApplications)
		throw new AppError("Not found", resCode.NOT_FOUND);

	return new ApiResponse(res, "Fetch successful", {
		applications: latestJobApplications.applications,
	});
};

export const getPublisherJobs = async (req: Request, res: Response) => {
	const publisher_id = res.locals.user.employer_details.id as string;

	const publisherJobs = await db.job.findMany({
		where: { publisher_id },
		include: { category: {}, _count: { select: { applications: true } } },
	});

	return new ApiResponse(res, "Fetch successful", {
		publisherJobs,
	});
};

export const getJobToBeEdited = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const safeParam = z
		.object({ id: getStringValidation("id") })
		.safeParse(req.params);
	if (!safeParam.success) return res.redirect("back");
	const { id } = safeParam.data;

	const JOB = await db.job.findFirst({
		where: { id },
		include: { category: {} },
	});

	if (!JOB) {
		res.locals.error = { message: "Job not found", details: { JOB } };
		return res.redirect("back");
	}
	res.locals.JOB = JOB;
	res.locals.title = "Edit " + JOB.title;

	const categories = await db.jobCategory.findMany();
	res.locals.jobCategories = categories;

	next();
};

// export const searchJobsByTitle = async (req: Request, res: Response) => {
// 	return new ApiResponse(res, "searchJobsByTitle here", {});
// };

// export const searchJobsByKeyWord = async (req: Request, res: Response) => {
// 	return new ApiResponse(res, "searchJobsByKeyWord here", {});
// };
