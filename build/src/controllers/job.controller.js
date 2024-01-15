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
exports.getPublisherJobs = exports.getLatestJobApplications = exports.getJobCategory = exports.searchJobs = exports.getRecomendedJobs = exports.getRecentJobs = exports.getJobDetail = exports.getJobs = exports.deleteJob = exports.editJob = exports.creatJob = void 0;
const response_controller_1 = require("./response.controller");
const prisma_1 = __importDefault(require("../../prisma"));
const zod_1 = require("zod");
const schema_1 = require("../validations/schema");
const NO_PER_PAGE = 8;
const creatJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return new response_controller_1.ApiResponse(res, "create jobs here", {});
});
exports.creatJob = creatJob;
const editJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return new response_controller_1.ApiResponse(res, "edith jobs here", {});
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
//# sourceMappingURL=job.controller.js.map