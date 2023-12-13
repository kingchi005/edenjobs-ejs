"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlyUsers = exports.onlyEmployers = exports.onlyApplicants = void 0;
const zod_1 = require("zod");
const response_controller_1 = require("./response.controller");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../../env"));
const helpers_controller_1 = require("./helpers.controller");
const prisma_1 = __importDefault(require("../../prisma"));
const onlyApplicants = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = res.locals.user;
    if (!user.is_applicant)
        throw new response_controller_1.AppError("Forbidden", response_controller_1.resCode.FORBIDDEN);
    next();
});
exports.onlyApplicants = onlyApplicants;
const onlyEmployers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = res.locals.user;
    if (user.is_applicant)
        throw new response_controller_1.AppError("Forbidden", response_controller_1.resCode.FORBIDDEN);
    next();
});
exports.onlyEmployers = onlyEmployers;
const onlyUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const isValid = zod_1.z.object({ authed: zod_1.z.string() }).safeParse(req.cookies);
    if (!isValid.success)
        throw new response_controller_1.AppError("Not logged in", response_controller_1.resCode.UNAUTHORIZED);
    const providedToken = isValid.data.authed;
    if (!providedToken)
        throw new response_controller_1.AppError("Invalid API key", response_controller_1.resCode.UNAUTHORIZED);
    const veriedToken = jsonwebtoken_1.default.verify(providedToken, env_1.default.HASH_SECRET);
    if (!(0, helpers_controller_1.isValidToken)(veriedToken))
        throw new response_controller_1.AppError("Invalid API key", response_controller_1.resCode.UNAUTHORIZED);
    const { id, exp } = veriedToken;
    if (exp && (0, helpers_controller_1.hasExpired)(exp))
        throw new response_controller_1.AppError("API key has expired", response_controller_1.resCode.UNAUTHORIZED);
    const user = yield prisma_1.default.user.findFirst({ where: { id } });
    if (!user)
        throw new response_controller_1.AppError("Invalid user", response_controller_1.resCode.UNAUTHORIZED);
    res.locals.user = user;
    next();
});
exports.onlyUsers = onlyUsers;
//# sourceMappingURL=middleware.controller.js.map