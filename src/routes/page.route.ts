import { Router, Request, Response } from "express";
import {
	middlewareWapper,
	tryCatchWapper,
} from "../controllers/response.controller";
import {
	getJobCategory,
	getJobDetail,
	getJobs,
	getRecentJobs,
	getRecomendedJobs,
} from "../controllers/job.controller";
import { formatDate } from "../controllers/helpers.controller";
import {
	onlyApplicants,
	onlyAuthenticated,
} from "../controllers/middleware.controller";
import { getUserJobApplications } from "../controllers/application.controller";
import { getApplicantDetails } from "../controllers/applicant.controller";
import jobsMetaData from "../models/jobs.json";

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
pageRoute.get(
	"/jobs",
	middlewareWapper(getJobs),
	middlewareWapper(getJobCategory),
	(req, res) => res.render("jobs", { title: "Edenjobs | jobs" })
);
pageRoute.get("/job/:id", middlewareWapper(getJobDetail), (req, res) =>
	res.render("job", { title: "Edenjobs | job" })
);

// auth pages
pageRoute.get("/login", (req, res) =>
	res.render("login", { title: "Edenjobs login" })
);

// Applicant pages
pageRoute.get(
	"/dashboard",
	middlewareWapper(onlyAuthenticated),
	middlewareWapper(onlyApplicants),
	middlewareWapper(getRecentJobs),
	middlewareWapper(getApplicantDetails),
	(req, res) => {
		res.render("applicant/index", { title: "Dashboard", page: "dashboard" });
	}
);
pageRoute.get(
	"/dashboard/jobs",
	middlewareWapper(onlyAuthenticated),
	middlewareWapper(onlyApplicants),
	middlewareWapper(getRecomendedJobs),
	(req, res) => {
		res.render("applicant/jobs", { title: "Recomended jobs", page: "jobs" });
	}
);
pageRoute.get(
	"/dashboard/applications",
	middlewareWapper(onlyAuthenticated),
	middlewareWapper(onlyApplicants),
	middlewareWapper(getUserJobApplications),
	(req, res) => {
		res.render("applicant/application", {
			title: "Applied jobs",
			page: "application",
		});
	}
);
pageRoute.get(
	"/dashboard/profile",
	middlewareWapper(onlyAuthenticated),
	middlewareWapper(onlyApplicants),
	middlewareWapper(getApplicantDetails),
	(req, res) => {
		res.render("applicant/profile", {
			title: "Profile",
			page: "profile",
			qualifications: jobsMetaData.qualifications,
			job_field: jobsMetaData.job_field,
			job_level: jobsMetaData.job_level,
			job_type: jobsMetaData.job_type,
			work_schedule: jobsMetaData.work_schedule,
		});
	}
);

// Employer pages

pageRoute.get("/modal", (req, res) => res.render("modal"));

export default pageRoute;
