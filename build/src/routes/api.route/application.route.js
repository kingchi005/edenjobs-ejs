"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const response_controller_1 = require("../../controllers/response.controller");
const middleware_controller_1 = require("../../controllers/middleware.controller");
const application_controller_1 = require("../../controllers/application.controller");
const jobApplicationRoute = (0, express_1.Router)();
jobApplicationRoute.post("/", (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyAuthenticated), (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyApplicants), (0, response_controller_1.tryCatchWapper)(application_controller_1.appliyForJob));
jobApplicationRoute.get("/:id", (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyAuthenticated), (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyApplicants), (0, response_controller_1.tryCatchWapper)(application_controller_1.getJobApplicationDetails));
exports.default = jobApplicationRoute;
//# sourceMappingURL=application.route.js.map