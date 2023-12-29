import { Router, Request, Response } from "express";
import {
	middlewareWapper,
	handlerWapper,
} from "../../controllers/response.controller";
import { logOut, loginUser } from "../../controllers/auth.controller";
import {
	updateAvatar,
	updateCvResume,
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
	handlerWapper(updateWorkDetails)
);

applicantRoute.put(
	"/job-preference",
	middlewareWapper(onlyAuthenticated),
	middlewareWapper(onlyApplicants),
	handlerWapper(updateJobPreferences)
);

applicantRoute.put(
	"/personal-details",
	middlewareWapper(onlyAuthenticated),
	middlewareWapper(onlyApplicants),
	handlerWapper(updatePersonalDetails)
);

applicantRoute.put(
	"/avatar",
	middlewareWapper(onlyAuthenticated),
	middlewareWapper(onlyApplicants),
	handlerWapper(updateAvatar)
);

applicantRoute.put(
	"/cv-resume",
	middlewareWapper(onlyAuthenticated),
	middlewareWapper(onlyApplicants),
	handlerWapper(updateCvResume)
);

export default applicantRoute;
