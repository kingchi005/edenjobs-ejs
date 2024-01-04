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
exports.updateCvResume = exports.updateAvatar = exports.updatePersonalDetails = exports.updateJobPreferences = exports.updateWorkDetails = exports.getApplicantDetails = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const input_validation_1 = __importDefault(require("../validations/input.validation"));
const response_controller_1 = require("./response.controller");
const helpers_controller_1 = require("./helpers.controller");
const zod_1 = require("zod");
const getApplicantDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const applicantDetails = yield prisma_1.default.applicant.findFirst({
        where: { user: { id: res.locals.user_id } },
        include: {
            _count: { select: { applications: true } },
            applications: {
                take: 1,
                include: { job: { include: { publisher: true, category: true } } },
            },
        },
    });
    res.locals.applicantDetails = applicantDetails;
    next();
});
exports.getApplicantDetails = getApplicantDetails;
const updateWorkDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safe = input_validation_1.default.updateWorkDetails.safeParse(req.fields);
    if (!safe.success)
        throw new response_controller_1.ValidationError(safe.error);
    const id = res.locals.user.id;
    const data = safe.data;
    const updated = yield prisma_1.default.applicant.updateMany({
        where: { user: { id } },
        data,
    });
    if (!updated)
        throw new response_controller_1.AppError("An error occoured", response_controller_1.resCode.NOT_ACCEPTED);
    return new response_controller_1.ApiResponse(res, "Work details updated successfully", { updated });
});
exports.updateWorkDetails = updateWorkDetails;
const updateJobPreferences = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safe = input_validation_1.default.updateJobPreferences.safeParse(req.fields);
    if (!safe.success)
        throw new response_controller_1.ValidationError(safe.error);
    const id = res.locals.user.id;
    const { Job_location: location_type, job_type: preferred_job_type, work_schedule, } = safe.data;
    const updated = yield prisma_1.default.applicant.updateMany({
        where: { user: { id } },
        data: { preferred_job_type, location_type, work_schedule },
    });
    if (!updated)
        throw new response_controller_1.AppError("An error occoured", response_controller_1.resCode.NOT_ACCEPTED);
    return new response_controller_1.ApiResponse(res, "Job preferences updated successfully", {
        updated,
    });
});
exports.updateJobPreferences = updateJobPreferences;
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
const updateAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = res.locals.user.id;
    const safe = zod_1.z
        .object({ avatar: input_validation_1.default.image })
        .safeParse(req.files);
    if (!safe.success)
        throw new response_controller_1.ValidationError(safe.error);
    const { avatar: image } = safe.data;
    const uploadImageRes = yield (0, helpers_controller_1.uploadFile)(image.path);
    if (uploadImageRes.error)
        throw new response_controller_1.AppError("An error Occoured", response_controller_1.resCode.BAD_GATEWAY, uploadImageRes.error);
    const avatar = uploadImageRes.url;
    const updated = yield prisma_1.default.applicant.updateMany({
        where: { user: { id } },
        data: { avatar },
    });
    if (!updated)
        throw new response_controller_1.AppError("An error occoured try again", response_controller_1.resCode.NOT_ACCEPTED);
    return new response_controller_1.ApiResponse(res, "Profile photo updated successfully");
});
exports.updateAvatar = updateAvatar;
const updateCvResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = res.locals.user.id;
    const safe = zod_1.z
        .object({ cv_resume: input_validation_1.default.image })
        .safeParse(req.files);
    if (!safe.success)
        throw new response_controller_1.ValidationError(safe.error);
    const { cv_resume: pdfFile } = safe.data;
    const uploadFileRes = yield (0, helpers_controller_1.uploadFile)(pdfFile.path);
    if (uploadFileRes.error)
        throw new response_controller_1.AppError("An error Occoured", response_controller_1.resCode.BAD_GATEWAY, uploadFileRes.error);
    const cv_resume_url = uploadFileRes.secure_url;
    const updated = yield prisma_1.default.applicant.updateMany({
        where: { user: { id } },
        data: { cv_resume_url },
    });
    if (!updated)
        throw new response_controller_1.AppError("An error occoured try again", response_controller_1.resCode.NOT_ACCEPTED);
    return new response_controller_1.ApiResponse(res, "Resume updated successfully");
});
exports.updateCvResume = updateCvResume;
//# sourceMappingURL=applicant.controller.js.map