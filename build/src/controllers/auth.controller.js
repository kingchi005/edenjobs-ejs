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
exports.registerEmployer = exports.registerApplicant = exports.logOut = exports.registerUser = exports.loginUser = void 0;
const response_controller_1 = require("./response.controller");
const input_validation_1 = __importDefault(require("../validations/input.validation"));
const prisma_1 = __importDefault(require("../../prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../../env"));
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safe = input_validation_1.default.login.safeParse(req.fields);
    if (!safe.success)
        throw new response_controller_1.ValidationError(safe.error);
    const { identifier, password: rawPass } = safe.data;
    const _user = yield prisma_1.default.user.findFirst({
        where: { OR: [{ username: identifier }, { email: identifier }] },
        include: { applicant_details: true, employer_details: true },
    });
    if (!_user)
        throw new response_controller_1.AppError("Incorrect email or username", response_controller_1.resCode.UNAUTHORIZED);
    const authorised = bcrypt_1.default.compareSync(rawPass, _user.password);
    if (!authorised)
        throw new response_controller_1.AppError("Incorrect password", response_controller_1.resCode.UNAUTHORIZED);
    const token = jsonwebtoken_1.default.sign({ id: _user.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 }, env_1.default.HASH_SECRET + "");
    res.cookie("@authed", token, {
        httpOnly: true,
        maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    res.locals.user = _user;
    const { password } = _user, user = __rest(_user, ["password"]);
    return new response_controller_1.ApiResponse(res, "login here", { user }).send();
});
exports.loginUser = loginUser;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const safe = input_validation_1.default.register.safeParse(req.fields);
    if (!safe.success)
        throw new response_controller_1.ValidationError(safe.error);
    const _a = safe.data, { password: rawPass } = _a, data = __rest(_a, ["password"]);
    const salt = bcrypt_1.default.genSaltSync(10);
    const password = yield bcrypt_1.default.hashSync(rawPass, salt);
    const user = yield prisma_1.default.user.create({
        data: Object.assign(Object.assign({}, data), { password }),
    });
    return new response_controller_1.ApiResponse(res, "register user here", {}).send();
});
exports.registerUser = registerUser;
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res
        .cookie("@authed", "", {
        httpOnly: true,
        maxAge: 1,
    })
        .redirect("/");
});
exports.logOut = logOut;
const registerApplicant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return new response_controller_1.ApiResponse(res, "register here", {}).send();
});
exports.registerApplicant = registerApplicant;
const registerEmployer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return new response_controller_1.ApiResponse(res, "register here", {}).send();
});
exports.registerEmployer = registerEmployer;
//# sourceMappingURL=auth.controller.js.map