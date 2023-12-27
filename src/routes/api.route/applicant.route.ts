import { Router, Request, Response } from "express";
import {
	middlewareWapper,
	tryCatchWapper,
} from "../../controllers/response.controller";
import {
	logOut,
	loginUser,
	registerUser,
} from "../../controllers/auth.controller";
import {
	updateJobPreferences,
	updatePersonalDetails,
	updateWorkDetails,
} from "../../controllers/applicant.controller";
import {
	onlyApplicants,
	onlyAuthenticated,
} from "../../controllers/middleware.controller";

const applicantRoute = Router();

applicantRoute.put(
	"/work-details",
	middlewareWapper(onlyAuthenticated),
	middlewareWapper(onlyApplicants),
	tryCatchWapper(updateWorkDetails)
);

applicantRoute.put(
	"/job-preference",
	middlewareWapper(onlyAuthenticated),
	middlewareWapper(onlyApplicants),
	tryCatchWapper(updateJobPreferences)
);

applicantRoute.put(
	"/personal-details",
	middlewareWapper(onlyAuthenticated),
	middlewareWapper(onlyApplicants),
	tryCatchWapper(updatePersonalDetails)
);

export default applicantRoute;
