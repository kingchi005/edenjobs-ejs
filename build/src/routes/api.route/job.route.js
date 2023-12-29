"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const response_controller_1 = require("../../controllers/response.controller");
const job_controller_1 = require("../../controllers/job.controller");
const jobRoute = (0, express_1.Router)();
jobRoute.get("/s", (0, response_controller_1.handlerWapper)(job_controller_1.searchJobs));
exports.default = jobRoute;
//# sourceMappingURL=job.route.js.map