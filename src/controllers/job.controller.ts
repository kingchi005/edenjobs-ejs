import { NextFunction, Request, Response } from "express";
import { ApiResponse, AppError } from "./response.controller";
import db from "../../prisma";

export const creatJob = async (req: Request, res: Response) => {
	return new ApiResponse(res, "create jobs here", {}).send();
};

export const edithJob = async (req: Request, res: Response) => {
	return new ApiResponse(res, "edith jobs here", {}).send();
};

export const getJobs = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const jobs = await db.job.findMany({
		take: 20,
		include: {
			_count: { select: { applications: true } },
			publisher: true,
			category: true,
		},
	});
	res.locals.recentJobs = jobs;
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
		take: 20,
		include: {
			_count: { select: { applications: true } },
			publisher: true,
			category: true,
		},
	});
	res.locals.recentJobs = recentJobs;

	next();
};

export const searchJobsByCategory = async (req: Request, res: Response) => {
	return new ApiResponse(res, "searchJobsByCategory here", {}).send();
};

export const searchJobsByTitle = async (req: Request, res: Response) => {
	return new ApiResponse(res, "searchJobsByTitle here", {}).send();
};

export const searchJobsByKeyWord = async (req: Request, res: Response) => {
	return new ApiResponse(res, "searchJobsByKeyWord here", {}).send();
};
