"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("./auth.route"));
const job_route_1 = __importDefault(require("./job.route"));
const application_route_1 = __importDefault(require("./application.route"));
const express_formidable_1 = __importDefault(require("express-formidable"));
const apiRoute = (0, express_1.Router)();
apiRoute.use((0, express_formidable_1.default)());
apiRoute.use("/auth", auth_route_1.default);
apiRoute.use("/job", job_route_1.default);
apiRoute.use("/application", application_route_1.default);
exports.default = apiRoute;
//# sourceMappingURL=index.js.map