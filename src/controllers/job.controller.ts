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

const NO_PER_PAGE = 8;
export const creatJob = async (req: Request, res: Response) => {
	return new ApiResponse(res, "create jobs here", {});
};

export const edithJob = async (req: Request, res: Response) => {
	return new ApiResponse(res, "edith jobs here", {});
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

// export const searchJobsByTitle = async (req: Request, res: Response) => {
// 	return new ApiResponse(res, "searchJobsByTitle here", {});
// };

// export const searchJobsByKeyWord = async (req: Request, res: Response) => {
// 	return new ApiResponse(res, "searchJobsByKeyWord here", {});
// };
