import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "./response.controller";
import db from "../../prisma";

export const getEmployerDetails = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const employerDetails = await db.employer.findFirst({
		where: { user: { id: res.locals.user_id } },
		include: {
			_count: { select: { jobs: true } },
			jobs: { select: { applications: {} } },
			// applications: {
			// 	take: 1,
			// 	include: { job: { include: { publisher: true, category: true } } },
			// },
		},
	});

	// console.log(employerDetails?.applications);

	res.locals.employerDetails = employerDetails;
	next();
};
// res.locals.user_id;
