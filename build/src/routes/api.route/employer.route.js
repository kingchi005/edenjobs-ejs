"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const response_controller_1 = require("../../controllers/response.controller");
const middleware_controller_1 = require("../../controllers/middleware.controller");
const employer_controller_1 = require("../../controllers/employer.controller");
const applicant_controller_1 = require("../../controllers/applicant.controller");
const employerRoute = (0, express_1.Router)();
employerRoute.put("/personal-details", (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyAuthenticated), (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyEmployers), (0, response_controller_1.handlerWapper)(applicant_controller_1.updatePersonalDetails));
employerRoute.put("/company-details", (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyAuthenticated), (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyEmployers), (0, response_controller_1.handlerWapper)(employer_controller_1.updateCompanyDetails));
employerRoute.put("/company-logo", (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyAuthenticated), (0, response_controller_1.middlewareWapper)(middleware_controller_1.onlyEmployers), (0, response_controller_1.handlerWapper)(employer_controller_1.updateCompanyLogo));
exports.default = employerRoute;
//# sourceMappingURL=employer.route.js.map