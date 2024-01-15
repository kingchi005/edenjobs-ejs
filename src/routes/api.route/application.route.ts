import { Router, Request, Response } from "express";
import {
	middlewareWapper,
	handlerWapper,
} from "../../controllers/response.controller";
import {
	onlyApplicants,
	onlyAuthenticated,
	onlyEmployers,
} from "../../controllers/middleware.controller";
import {
	appliyForJob,
	getApplications,
	getJobApplicationDetails,
	sendJobInvite,
} from "../../controllers/application.controller";

const jobApplicationRoute = Router();

/**
 * route :- '/api/job-application'
 *
 */

jobApplicationRoute.post(
	"/",
	middlewareWapper(onlyApplicants),
	handlerWapper(appliyForJob)
);

jobApplicationRoute.get(
	"/",
	middlewareWapper(onlyEmployers),
	handlerWapper(getApplications)
);

jobApplicationRoute.get(
	"/:id",
	middlewareWapper(onlyApplicants),
	handlerWapper(getJobApplicationDetails)
);

jobApplicationRoute.put(
	"/invite/:id",
	middlewareWapper(onlyEmployers),
	handlerWapper(sendJobInvite)
);

export default jobApplicationRoute;
