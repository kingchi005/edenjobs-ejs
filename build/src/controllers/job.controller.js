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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobToBeEdited = exports.getPublisherJobs = exports.getLatestJobApplications = exports.getJobCategory = exports.searchJobs = exports.getRecomendedJobs = exports.getRecentJobs = exports.getJobDetail = exports.getJobs = exports.deleteJob = exports.editJob = exports.creatJob = void 0;
const response_controller_1 = require("./response.controller");
const prisma_1 = __importDefault(require("../../prisma"));
const zod_1 = require("zod");
const schema_1 = require("../validations/schema");
const input_validation_1 = __importDefault(require("../validations/input.validation"));
const NO_PER_PAGE = 8;
const creatJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const publisher_id = res.locals.user.employer_details.id;
    const safe = input_validation_1.default.createJob.safeParse(req.fields);
    if (!safe.success)
        throw new response_controller_1.ValidationError(safe.error);
    const _a = safe.data, { job_location } = _a, data = __rest(_a, ["job_location"]);
    const is_remote = job_location === "Remote";
    const createdJob = yield prisma_1.default.job.create({
        data: Object.assign(Object.assign({}, data), { publisher_id,
            is_remote }),
    });
    if (!createdJob)
        throw new response_controller_1.AppError("An Error occoured", response_controller_1.resCode.NOT_ACCEPTED, {
            createdJob,
        });
    return new response_controller_1.ApiResponse(res, "Job Created successfully", { createdJob });
});
exports.creatJob = creatJob;
const editJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safeParam = zod_1.z
        .object({ id: (0, schema_1.getStringValidation)("id") })
        .safeParse(req.params);
    if (!safeParam.success)
        throw new response_controller_1.ValidationError(safeParam.error);
    const { id: job_id } = safeParam.data;
    const safe = input_validation_1.default.editJob.safeParse(req.fields);
    if (!safe.success)
        throw new response_controller_1.ValidationError(safe.error);
    const _b = safe.data, { job_location } = _b, data = __rest(_b, ["job_location"]);
    const is_remote = job_location === "Remote";
    const editedJob = yield prisma_1.default.job.update({
        where: { id: job_id },
        data: Object.assign(Object.assign({}, data), { is_remote }),
    });
    if (!editedJob)
        throw new response_controller_1.AppError("An Error occoured", response_controller_1.resCode.NOT_ACCEPTED, {
            editedJob,
        });
    return new response_controller_1.ApiResponse(res, "Job Updated successfully", { editedJob });
});
exports.editJob = editJob;
const deleteJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safe = zod_1.z
        .object({ id: (0, schema_1.getStringValidation)("id") })
        .safeParse(req.params);
    if (!safe.success)
        throw new response_controller_1.ValidationError(safe.error);
    const { id } = safe.data;
    const deletedJob = yield prisma_1.default.job.delete({ where: { id } });
    if (!exports.deleteJob)
        throw new response_controller_1.AppError("Not found", response_controller_1.resCode.NOT_FOUND, exports.deleteJob);
    return new response_controller_1.ApiResponse(res, `Job deleted `, { deletedJob });
});
exports.deleteJob = deleteJob;
const getJobs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const jobs = yield prisma_1.default.job.findMany({
        take: NO_PER_PAGE,
        include: {
            _count: { select: { applications: true } },
            publisher: true,
            category: true,
        },
    });
    res.locals.jobs = jobs;
    next();
});
exports.getJobs = getJobs;
const getJobDetail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield prisma_1.default.job.findFirst({
        where: { id: req.params.id },
        include: {
            _count: { select: { applications: true } },
            publisher: true,
            category: true,
            applications: true,
        },
    });
    res.locals.job = job;
    next();
});
exports.getJobDetail = getJobDetail;
const getRecentJobs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const recentJobs = yield prisma_1.default.job.findMany({
        orderBy: { published_at: "asc" },
        take: 10,
        include: {
            _count: { select: { applications: true } },
            publisher: true,
            category: true,
        },
    });
    res.locals.recentJobs = recentJobs;
    next();
});
exports.getRecentJobs = getRecentJobs;
const getRecomendedJobs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const jobs = yield prisma_1.default.job.findMany({
        take: 5,
        include: {
            _count: { select: { applications: true } },
            publisher: true,
            category: true,
        },
    });
    res.locals.recommendedJobs = jobs;
    next();
});
exports.getRecomendedJobs = getRecomendedJobs;
const searchJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = +(req.query.page || 1);
    const skip = (page - 1) * NO_PER_PAGE;
    let where = {
        AND: [
            {
                OR: [
                    { title: { contains: req.query.search_word || "" } },
                    { summary: { contains: req.query.search_word || "" } },
                ],
            },
        ],
    };
    if (req.query.category_id) {
        where.AND.push({ category_id: +req.query.category_id });
    }
    if (req.query.min_salary) {
        where.AND.push({ max_salary: { gte: +req.query.min_salary || 100 } });
    }
    if (req.query.remote) {
        where.AND.push({ is_remote: !!+req.query.remote });
    }
    const jobs = yield prisma_1.default.job.findMany({
        where,
        include: {
            publisher: true,
            category: true,
            _count: { select: { applications: true } },
        },
    });
    if (!jobs)
        return new response_controller_1.ApiResponse(res, "No jobs found", {});
    return new response_controller_1.ApiResponse(res, "success", { jobs });
});
exports.searchJobs = searchJobs;
const getJobCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const jobCategories = yield prisma_1.default.jobCategory.findMany();
    res.locals.jobCategories = jobCategories;
    next();
});
exports.getJobCategory = getJobCategory;
const getLatestJobApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safe = zod_1.z
        .object({ id: (0, schema_1.getStringValidation)("id") })
        .safeParse(req.params);
    if (!safe.success)
        throw new response_controller_1.ValidationError(safe.error);
    const id = safe.data.id;
    const latestJobApplications = yield prisma_1.default.job.findFirst({
        where: { id },
        select: {
            applications: {
                include: {
                    applicant: {
                        select: {
                            avatar: true,
                            user: {
                                select: { first_name: true, last_name: true, email: true },
                            },
                        },
                    },
                },
            },
        },
    });
    if (!latestJobApplications)
        throw new response_controller_1.AppError("Not found", response_controller_1.resCode.NOT_FOUND);
    return new response_controller_1.ApiResponse(res, "Fetch successful", {
        applications: latestJobApplications.applications,
    });
});
exports.getLatestJobApplications = getLatestJobApplications;
const getPublisherJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const publisher_id = res.locals.user.employer_details.id;
    const publisherJobs = yield prisma_1.default.job.findMany({
        where: { publisher_id },
        include: { category: {}, _count: { select: { applications: true } } },
    });
    return new response_controller_1.ApiResponse(res, "Fetch successful", {
        publisherJobs,
    });
});
exports.getPublisherJobs = getPublisherJobs;
const getJobToBeEdited = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const safeParam = zod_1.z
        .object({ id: (0, schema_1.getStringValidation)("id") })
        .safeParse(req.params);
    if (!safeParam.success)
        return res.redirect("back");
    const { id } = safeParam.data;
    const JOB = yield prisma_1.default.job.findFirst({
        where: { id },
        include: { category: {} },
    });
    if (!JOB) {
        res.locals.error = { message: "Job not found", details: { JOB } };
        return res.redirect("back");
    }
    res.locals.JOB = JOB;
    res.locals.title = "Edit " + JOB.title;
    const categories = yield prisma_1.default.jobCategory.findMany();
    res.locals.jobCategories = categories;
    next();
});
exports.getJobToBeEdited = getJobToBeEdited;
//# sourceMappingURL=job.controller.js.map