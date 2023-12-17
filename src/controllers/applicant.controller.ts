import { NextFunction, Request, Response } from "express";
import db from "../../prisma";

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
