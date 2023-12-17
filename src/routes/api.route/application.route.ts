import { Router, Request, Response } from "express";
import {
	middlewareWapper,
	tryCatchWapper,
} from "../../controllers/response.controller";
import {
	onlyApplicants,
	onlyAuthenticated,
} from "../../controllers/middleware.controller";
import { appliyForJob } from "../../controllers/application.controller";

const jobApplicationRoute = Router();

/* 
- create Application => applicant
- get application /:id => user
- edith application /:id => applicant
*/

jobApplicationRoute.post(
	"/",
	middlewareWapper(onlyAuthenticated),
	middlewareWapper(onlyApplicants),
	tryCatchWapper(appliyForJob)
);

export default jobApplicationRoute;
