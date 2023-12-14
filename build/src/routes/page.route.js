"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const response_controller_1 = require("../controllers/response.controller");
const job_controller_1 = require("../controllers/job.controller");
const helpers_controller_1 = require("../controllers/helpers.controller");
const pageRoute = (0, express_1.Router)();
pageRoute.get("*", (req, res, next) => {
    res.locals.helper = { formatDate: helpers_controller_1.formatDate };
    next();
});
pageRoute.get("/", (0, response_controller_1.middlewareWapper)(job_controller_1.getRecentJobs), (req, res) => res.render("index", {
    title: "Find any kind of jobs in edenjobs",
}));
pageRoute.get("/jobs", (0, response_controller_1.middlewareWapper)(job_controller_1.getJobs), (req, res) => res.render("jobs", { title: "Edenjobs | jobs" }));
pageRoute.get("/job/:id", (0, response_controller_1.middlewareWapper)(job_controller_1.getJobDetail), (req, res) => res.render("job", { title: "Edenjobs | job" }));
pageRoute.get("/login", (req, res) => res.render("login", { title: "Edenjobs login" }));
pageRoute.get("/modal", (req, res) => res.render("modal"));
exports.default = pageRoute;
//# sourceMappingURL=page.route.js.map