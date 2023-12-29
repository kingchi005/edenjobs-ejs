import { Router, Request, Response } from "express";
import {
	middlewareWapper,
	handlerWapper,
} from "../../controllers/response.controller";
import {
	onlyApplicants,
	onlyAuthenticated,
} from "../../controllers/middleware.controller";
import {
	appliyForJob,
	getJobApplicationDetails,
} from "../../controllers/application.controller";

const jobApplicationRoute = Router();

/* 
- create Application => applicant
- get application /:id => user
- edith application /:id => applicant
*/

jobApplicationRoute.post(
	"/",
	// middlewareWapper(onlyAuthenticated),
	middlewareWapper(onlyApplicants),
	handlerWapper(appliyForJob)
);

jobApplicationRoute.get(
	"/:id",
	// middlewareWapper(onlyAuthenticated),
	middlewareWapper(onlyApplicants),
	handlerWapper(getJobApplicationDetails)
);

export default jobApplicationRoute;
