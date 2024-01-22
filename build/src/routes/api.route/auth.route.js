"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const response_controller_1 = require("../../controllers/response.controller");
const auth_controller_1 = require("../../controllers/auth.controller");
const authRoute = (0, express_1.Router)();
authRoute.post("/login", (0, response_controller_1.handlerWapper)(auth_controller_1.loginUser));
authRoute.get("/logout", (0, response_controller_1.handlerWapper)(auth_controller_1.logOut));
authRoute.post("/register", (0, response_controller_1.handlerWapper)(auth_controller_1.registerApplicant));
authRoute.post("/employer/register", (0, response_controller_1.handlerWapper)(auth_controller_1.registerEmployer));
exports.default = authRoute;
//# sourceMappingURL=auth.route.js.map