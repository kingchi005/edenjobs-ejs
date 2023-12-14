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
exports.searchJobsByKeyWord = exports.searchJobsByTitle = exports.searchJobsByCategory = exports.getRecentJobs = exports.getJobDetail = exports.getJobs = exports.edithJob = exports.creatJob = void 0;
const response_controller_1 = require("./response.controller");
const prisma_1 = __importDefault(require("../../prisma"));
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
        take: 20,
        include: {
            _count: { select: { applications: true } },
            publisher: true,
            category: true,
        },
    });
    res.locals.recentJobs = jobs;
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
        take: 20,
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
const searchJobsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return new response_controller_1.ApiResponse(res, "searchJobsByCategory here", {}).send();
});
exports.searchJobsByCategory = searchJobsByCategory;
const searchJobsByTitle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return new response_controller_1.ApiResponse(res, "searchJobsByTitle here", {}).send();
});
exports.searchJobsByTitle = searchJobsByTitle;
const searchJobsByKeyWord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return new response_controller_1.ApiResponse(res, "searchJobsByKeyWord here", {}).send();
});
exports.searchJobsByKeyWord = searchJobsByKeyWord;
//# sourceMappingURL=job.controller.js.map