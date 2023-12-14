import { Router, Request, Response } from "express";
import {
	middlewareWapper,
	tryCatchWapper,
} from "../controllers/response.controller";
import {
	getJobDetail,
	getJobs,
	getRecentJobs,
} from "../controllers/job.controller";
import { formatDate } from "../controllers/helpers.controller";

const pageRoute = Router();

pageRoute.get("*", (req, res, next) => {
	res.locals.helper = { formatDate };
	next();
});
// homepages
pageRoute.get("/", middlewareWapper(getRecentJobs), (req, res) =>
	res.render("index", {
		title: "Find any kind of jobs in edenjobs",
	})
);

// job pages
pageRoute.get("/jobs", middlewareWapper(getJobs), (req, res) =>
	res.render("jobs", { title: "Edenjobs | jobs" })
);
pageRoute.get("/job/:id", middlewareWapper(getJobDetail), (req, res) =>
	res.render("job", { title: "Edenjobs | job" })
);

// auth pages
pageRoute.get("/login", (req, res) =>
	res.render("login", { title: "Edenjobs login" })
);

// Applicant pages
// pageRoute.get("/job/:id", middlewareWapper(getJobDetail), (req, res) => {
// 	res.render("job", { title: "Edenjobs | job" });
// });

// EMployer pages

pageRoute.get("/modal", (req, res) => res.render("modal"));

export default pageRoute;
