"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const response_controller_1 = require("../../controllers/response.controller");
const job_controller_1 = require("../../controllers/job.controller");
const middleware_controller_1 = require("../../controllers/middleware.controller");
const jobRoute = (0, express_1.Router)();
jobRoute.post("/", (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyAuthenticated), (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyEmployers), (0, response_controller_1.handlerWapper)(job_controller_1.creatJob));
jobRoute.put("/:id", (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyAuthenticated), (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyEmployers), (0, response_controller_1.handlerWapper)(job_controller_1.editJob));
jobRoute.delete("/:id", (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyAuthenticated), (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyEmployers), (0, response_controller_1.handlerWapper)(job_controller_1.deleteJob));
jobRoute.get("/s", (0, response_controller_1.handlerWapper)(job_controller_1.searchJobs));
jobRoute.get("/applications/:id", (0, response_controller_1.handlerWapper)(job_controller_1.getLatestJobApplications));
jobRoute.get("/", (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyAuthenticated), (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyEmployers), (0, response_controller_1.handlerWapper)(job_controller_1.getPublisherJobs));
exports.default = jobRoute;
//# sourceMappingURL=job.route.js.map