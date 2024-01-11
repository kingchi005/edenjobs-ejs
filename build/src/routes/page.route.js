"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const response_controller_1 = require("../controllers/response.controller");
const job_controller_1 = require("../controllers/job.controller");
const helpers_controller_1 = require("../controllers/helpers.controller");
const middleware_controller_1 = require("../controllers/middleware.controller");
const application_controller_1 = require("../controllers/application.controller");
const applicant_controller_1 = require("../controllers/applicant.controller");
const jobs_json_1 = __importDefault(require("../models/jobs.json"));
const employer_controller_1 = require("../controllers/employer.controller");
const pageRoute = (0, express_1.Router)();
pageRoute.get("*", (req, res, next) => {
    res.locals.helper = { formatDate: helpers_controller_1.formatDate };
    next();
});
pageRoute.get("/", (0, response_controller_1.middlewareWapper)(job_controller_1.getRecentJobs), (req, res) => res.render("index", {
    title: "Find any kind of jobs in edenjobs",
}));
pageRoute.get("/jobs", (0, response_controller_1.middlewareWapper)(job_controller_1.getJobs), (0, response_controller_1.middlewareWapper)(job_controller_1.getJobCategory), (req, res) => res.render("jobs", { title: "Edenjobs | jobs" }));
pageRoute.get("/about-us", (req, res) => res.render("aboutus", { title: "About Edenjobs" }));
pageRoute.get("/job/:id", (0, response_controller_1.middlewareWapper)(job_controller_1.getJobDetail), (req, res) => res.render("job", { title: "Edenjobs | job" }));
pageRoute.get("/login", (req, res) => res.render("login", { title: "Edenjobs login" }));
pageRoute.get("/register", (req, res) => res.render("applicant/register", {
    title: "Edenjobs Sign up",
    initSelOptions: {
        qualifications: jobs_json_1.default.qualifications,
        job_field: jobs_json_1.default.job_field,
        job_level: jobs_json_1.default.job_level,
        job_type: jobs_json_1.default.job_type,
        work_schedule: jobs_json_1.default.work_schedule,
    },
}));
pageRoute.get("/dashboard", (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyAuthenticated), (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyApplicants), (0, response_controller_1.middlewareWapper)(job_controller_1.getRecentJobs), (0, response_controller_1.middlewareWapper)(applicant_controller_1.getApplicantDetails), (req, res) => {
    res.render("applicant/index", { title: "Dashboard", page: "dashboard" });
});
pageRoute.get("/dashboard/job/:id", (0, response_controller_1.middlewareWapper)(job_controller_1.getJobDetail), (req, res) => res.render("applicant/job", { title: "Edenjobs | job", page: "job" }));
pageRoute.get("/dashboard/jobs", (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyAuthenticated), (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyApplicants), (0, response_controller_1.middlewareWapper)(job_controller_1.getJobs), (0, response_controller_1.middlewareWapper)(job_controller_1.getJobCategory), (req, res) => {
    res.render("applicant/jobs", { title: "Recomended jobs", page: "jobs" });
});
pageRoute.get("/dashboard/applications", (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyAuthenticated), (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyApplicants), (0, response_controller_1.middlewareWapper)(application_controller_1.getUserJobApplications), (req, res) => {
    res.render("applicant/application", {
        title: "Applied jobs",
        page: "application",
    });
});
pageRoute.get("/dashboard/profile", (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyAuthenticated), (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyApplicants), (0, response_controller_1.middlewareWapper)(applicant_controller_1.getApplicantDetails), (req, res) => {
    res.render("applicant/profile", {
        title: "Profile",
        page: "profile",
        initSelOptions: {
            qualifications: jobs_json_1.default.qualifications,
            job_field: jobs_json_1.default.job_field,
            job_level: jobs_json_1.default.job_level,
            job_type: jobs_json_1.default.job_type,
            work_schedule: jobs_json_1.default.work_schedule,
        },
    });
});
pageRoute.get("/recruiter/register", (req, res) => {
    res.render("employer/register", { title: "Sign up as Recruiter" });
});
pageRoute.get("/recruiter/dashboard", (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyAuthenticated), (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyEmployers), (0, response_controller_1.middlewareWapper)(employer_controller_1.getEmployerDetails), (req, res) => {
    res.render("employer/index", {
        title: "Dashboard",
        page: "dashboard",
    });
});
pageRoute.get("/recruiter/job/:id", (0, response_controller_1.middlewareWapper)(job_controller_1.getJobDetail), (req, res) => res.render("applicant/job", { title: "Edenjobs | job", page: "job" }));
pageRoute.get("/recruiter/jobs", (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyAuthenticated), (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyEmployers), (req, res) => {
    res.render("employer/jobs", { title: "Created Jobs", page: "jobs" });
});
pageRoute.get("/recruiter/applications", (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyAuthenticated), (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyEmployers), (req, res) => {
    res.render("employer/applications", {
        title: "Applications",
        page: "applications",
    });
});
pageRoute.get("/recruiter/application/:id", (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyAuthenticated), (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyEmployers), (0, response_controller_1.middlewareWapper)(application_controller_1.getApplicationDetails), (req, res) => {
    res.render("employer/application", {
        title: "Applications",
        page: "applications",
    });
});
pageRoute.get("/recruiter/profile", (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyAuthenticated), (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyEmployers), (0, response_controller_1.middlewareWapper)(employer_controller_1.getEmployerDetails), (req, res) => {
    res.render("employer/profile", {
        title: "My Profile",
        page: "profile",
        STATES: jobs_json_1.default.states,
        COMPANY_SIZE: jobs_json_1.default.company_size,
        JOB_FIELD: jobs_json_1.default.job_field,
    });
});
exports.default = pageRoute;
//# sourceMappingURL=page.route.js.map