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
exports.getJobCategory = exports.searchJobs = exports.getRecomendedJobs = exports.getRecentJobs = exports.getJobDetail = exports.getJobs = exports.edithJob = exports.creatJob = void 0;
const response_controller_1 = require("./response.controller");
const prisma_1 = __importDefault(require("../../prisma"));
const NO_PER_PAGE = 8;
const creatJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return new response_controller_1.ApiResponse(res, "create jobs here", {}).send();
});
exports.creatJob = creatJob;
const edithJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return new response_controller_1.ApiResponse(res, "edith jobs here", {}).send();
});
exports.edithJob = edithJob;
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
    const recommendedJobs = yield prisma_1.default.job.findMany({
        take: 5,
        include: {
            _count: { select: { applications: true } },
            publisher: true,
            category: true,
        },
    });
    res.locals.recommendedJobs = recommendedJobs;
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
        return new response_controller_1.ApiResponse(res, "No jobs found", {}).send();
    return new response_controller_1.ApiResponse(res, "success", { jobs }).send();
});
exports.searchJobs = searchJobs;
const getJobCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const jobCategories = yield prisma_1.default.jobCategory.findMany();
    res.locals.jobCategories = jobCategories;
    next();
});
exports.getJobCategory = getJobCategory;
//# sourceMappingURL=job.controller.js.map