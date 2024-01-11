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
exports.updateCompanyLogo = exports.updateCompanyDetails = exports.updatePersonalDetails = exports.getEmployerDetails = void 0;
const response_controller_1 = require("./response.controller");
const prisma_1 = __importDefault(require("../../prisma"));
const input_validation_1 = __importDefault(require("../validations/input.validation"));
const zod_1 = require("zod");
const helpers_controller_1 = require("./helpers.controller");
const getEmployerDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const employerDetails = yield prisma_1.default.employer.findFirst({
        where: { user: { id: res.locals.user_id } },
        include: {
            _count: { select: { jobs: true } },
            jobs: {
                include: {
                    _count: { select: { applications: true } },
                    category: true,
                },
                take: 1,
            },
        },
    });
    res.locals.employerDetails = employerDetails;
    let apl_count = 0;
    for (let i = 0; i < employerDetails.jobs.length; i++) {
        apl_count += employerDetails.jobs[i]._count.applications;
    }
    res.locals.employerDetails.apl_count = apl_count;
    next();
});
exports.getEmployerDetails = getEmployerDetails;
const updatePersonalDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safe = input_validation_1.default.updatePersonalDetails.safeParse(req.fields);
    if (!safe.success)
        throw new response_controller_1.ValidationError(safe.error);
    const id = res.locals.user.id;
    const { address, first_name, last_name } = safe.data;
    const updated = yield prisma_1.default.user.updateMany({
        where: { id },
        data: { first_name, last_name, address },
    });
    if (!updated)
        throw new response_controller_1.AppError("An error occoured", response_controller_1.resCode.NOT_ACCEPTED);
    return new response_controller_1.ApiResponse(res, "Personal details updated successfully", {
        updated,
    });
});
exports.updatePersonalDetails = updatePersonalDetails;
const updateCompanyDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = res.locals.user) === null || _a === void 0 ? void 0 : _a.id;
    const safe = input_validation_1.default.updateCompanyDetails.safeParse(req.fields);
    if (!safe.success)
        throw new response_controller_1.ValidationError(safe.error);
    const data = safe.data;
    const updated = yield prisma_1.default.employer.updateMany({
        where: { user: { id } },
        data,
    });
    return new response_controller_1.ApiResponse(res, "Company details updated succesfully", {
        updated,
    });
});
exports.updateCompanyDetails = updateCompanyDetails;
const updateCompanyLogo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = res.locals.user.id;
    const safe = zod_1.z.object({ logo: input_validation_1.default.image }).safeParse(req.files);
    if (!safe.success)
        throw new response_controller_1.ValidationError(safe.error);
    const { logo: image } = safe.data;
    const uploadImageRes = yield (0, helpers_controller_1.uploadFile)(image.path);
    if (uploadImageRes.error)
        throw new response_controller_1.AppError("An error Occoured", response_controller_1.resCode.BAD_GATEWAY, uploadImageRes.error);
    const company_logo = uploadImageRes.url;
    const updated = yield prisma_1.default.employer.updateMany({
        where: { user: { id } },
        data: { company_logo },
    });
    if (!updated)
        throw new response_controller_1.AppError("An error occoured try again", response_controller_1.resCode.NOT_ACCEPTED);
    return new response_controller_1.ApiResponse(res, "Company logo updated successfully");
});
exports.updateCompanyLogo = updateCompanyLogo;
//# sourceMappingURL=employer.controller.js.map