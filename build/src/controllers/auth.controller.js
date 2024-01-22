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
exports.registerEmployer = exports.registerApplicant = exports.logOut = exports.loginUser = void 0;
const response_controller_1 = require("./response.controller");
const input_validation_1 = __importDefault(require("../validations/input.validation"));
const prisma_1 = __importDefault(require("../../prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../../env"));
const helpers_controller_1 = require("./helpers.controller");
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safe = input_validation_1.default.login.safeParse(req.fields);
    if (!safe.success)
        throw new response_controller_1.ValidationError(safe.error);
    const { identifier, password: rawPass } = safe.data;
    const _user = yield prisma_1.default.user.findFirst({
        where: {
            OR: [
                { username: { equals: identifier } },
                { email: { equals: identifier } },
            ],
        },
        include: { applicant_details: true, employer_details: true },
    });
    if (!_user)
        throw new response_controller_1.AppError("Incorrect email or username", response_controller_1.resCode.UNAUTHORIZED);
    const authorised = bcrypt_1.default.compareSync(rawPass, _user.password);
    if (!authorised)
        throw new response_controller_1.AppError("Incorrect password", response_controller_1.resCode.UNAUTHORIZED);
    const token = jsonwebtoken_1.default.sign({ id: _user.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 }, env_1.default.HASH_SECRET + "");
    res.cookie(env_1.default.AUTH_COOKIE, token, {
        httpOnly: true,
        maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    res.locals.user = _user;
    const { password } = _user, user = __rest(_user, ["password"]);
    return new response_controller_1.ApiResponse(res, "login here", { user });
});
exports.loginUser = loginUser;
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res
        .cookie(env_1.default.AUTH_COOKIE, "", {
        httpOnly: true,
        maxAge: 1,
    })
        .redirect("/");
});
exports.logOut = logOut;
const registerApplicant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safe = input_validation_1.default.registerApplicant.safeParse(req.fields);
    if (!safe.success)
        throw new response_controller_1.ValidationError(safe.error);
    const safeFiles = input_validation_1.default.registerApplicantFile.safeParse(req.files);
    if (!safeFiles.success)
        throw new response_controller_1.ValidationError(safeFiles.error);
    const { cv_resume: cv_file, avatar: avatar_file } = safeFiles.data;
    const _a = safe.data, { password: rawPass, address, date_of_birth, email, first_name, gender, username, last_name } = _a, applicant_details = __rest(_a, ["password", "address", "date_of_birth", "email", "first_name", "gender", "username", "last_name"]);
    const uploadAvFileRes = yield (0, helpers_controller_1.uploadFile)(avatar_file.path);
    if (uploadAvFileRes.error)
        throw new response_controller_1.AppError("An error Occoured", response_controller_1.resCode.BAD_GATEWAY, uploadAvFileRes.error);
    const avatar = uploadAvFileRes.url;
    const uploadCvFileRes = yield (0, helpers_controller_1.uploadFile)(cv_file.path);
    if (uploadAvFileRes.error)
        throw new response_controller_1.AppError("An error Occoured", response_controller_1.resCode.BAD_GATEWAY, uploadAvFileRes.error);
    const cv_resume_url = uploadCvFileRes.secure_url;
    const password = bcrypt_1.default.hashSync(rawPass, bcrypt_1.default.genSaltSync(10));
    const user = yield prisma_1.default.user.create({
        data: {
            address,
            date_of_birth,
            email,
            first_name,
            gender,
            last_name,
            password,
            username,
            applicant_details: {
                create: Object.assign({ avatar, cv_resume_url }, applicant_details),
            },
        },
    });
    return new response_controller_1.ApiResponse(res, "Registration successful", {});
});
exports.registerApplicant = registerApplicant;
const registerEmployer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safe = input_validation_1.default.registerEmployer.safeParse(req.fields);
    if (!safe.success)
        throw new response_controller_1.ValidationError(safe.error);
    const safeFiles = input_validation_1.default.registerEmployerFile.safeParse(req.files);
    if (!safeFiles.success)
        throw new response_controller_1.ValidationError(safeFiles.error);
    const { company_logo: avatar_file } = safeFiles.data;
    const _b = safe.data, { password: rawPass, address, date_of_birth, email, first_name, gender, username, last_name, is_applicant: no } = _b, employer_details = __rest(_b, ["password", "address", "date_of_birth", "email", "first_name", "gender", "username", "last_name", "is_applicant"]);
    const uploadAvFileRes = yield (0, helpers_controller_1.uploadFile)(avatar_file.path);
    if (uploadAvFileRes.error)
        throw new response_controller_1.AppError("An error Occoured", response_controller_1.resCode.BAD_GATEWAY, uploadAvFileRes.error);
    const company_logo = uploadAvFileRes.url;
    const password = bcrypt_1.default.hashSync(rawPass, bcrypt_1.default.genSaltSync(10));
    const user = yield prisma_1.default.user.create({
        data: {
            address,
            date_of_birth,
            email,
            first_name,
            gender,
            last_name,
            password,
            username,
            is_applicant: false,
            employer_details: { create: Object.assign(Object.assign({}, employer_details), { company_logo }) },
        },
    });
    return new response_controller_1.ApiResponse(res, "Registration successful", {});
});
exports.registerEmployer = registerEmployer;
//# sourceMappingURL=auth.controller.js.map