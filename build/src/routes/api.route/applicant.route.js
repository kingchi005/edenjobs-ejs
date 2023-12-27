"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const response_controller_1 = require("../../controllers/response.controller");
const applicant_controller_1 = require("../../controllers/applicant.controller");
const middleware_controller_1 = require("../../controllers/middleware.controller");
const applicantRoute = (0, express_1.Router)();
applicantRoute.put("/work-details", (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyAuthenticated), (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyApplicants), (0, response_controller_1.tryCatchWapper)(applicant_controller_1.updateWorkDetails));
applicantRoute.put("/job-preference", (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyAuthenticated), (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyApplicants), (0, response_controller_1.tryCatchWapper)(applicant_controller_1.updateJobPreferences));
applicantRoute.put("/personal-details", (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyAuthenticated), (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyApplicants), (0, response_controller_1.tryCatchWapper)(applicant_controller_1.updatePersonalDetails));
exports.default = applicantRoute;
//# sourceMappingURL=applicant.route.js.map