import { Router, Request, Response } from "express";
import {
	handlerWapper,
	middlewareWapper,
} from "../../controllers/response.controller";
import {
	creatJob,
	deleteJob,
	editJob,
	getLatestJobApplications,
	getPublisherJobs,
	searchJobs,
} from "../../controllers/job.controller";
import {
	onlyAuthenticated,
	onlyEmployers,
} from "../../controllers/middleware.controller";

const jobRoute = Router();

/**
 * route :- '/api/job'
 */

jobRoute.post(
	"/",
	middlewareWapper(onlyAuthenticated),
	middlewareWapper(onlyEmployers),
	handlerWapper(creatJob)
);
jobRoute.put(
	"/:id",
	middlewareWapper(onlyAuthenticated),
	middlewareWapper(onlyEmployers),
	handlerWapper(editJob)
);
jobRoute.delete(
	"/:id",
	middlewareWapper(onlyAuthenticated),
	middlewareWapper(onlyEmployers),
	handlerWapper(deleteJob)
);
jobRoute.get("/s", handlerWapper(searchJobs));
jobRoute.get("/applications/:id", handlerWapper(getLatestJobApplications));
jobRoute.get(
	"/",
	middlewareWapper(onlyAuthenticated),
	middlewareWapper(onlyEmployers),
	handlerWapper(getPublisherJobs)
);

// you can pretect from here
//  middlewareWapper(onlyAuthenticated),

export default jobRoute;
