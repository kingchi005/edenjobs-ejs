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
Object.defineProperty(exports, "__esModule", { value: true });
exports.middlewareWapper = exports.tryCatchWapper = exports.possiblePrismaError = exports.errMsgEnum = exports.resCode = exports.ApiResponse = exports.ValidationError = exports.AppError = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const library_1 = require("@prisma/client/runtime/library");
class AppError extends Error {
    constructor(message, statusCode, details) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.details = details;
    }
}
exports.AppError = AppError;
class ValidationError extends Error {
    constructor(error) {
        super(error.issues.map((d) => d.message).join(", "));
        this.error = error;
        this.statusCode = exports.resCode.BAD_REQUEST;
        this.details = error;
    }
}
exports.ValidationError = ValidationError;
class ApiResponse {
    constructor(res, message, details, statusCode = exports.resCode.OK, ok = true) {
        this.res = res;
        this.message = message;
        this.details = details;
        this.statusCode = statusCode;
        this.ok = ok;
    }
    send() {
        return this.res.status(this.statusCode).json({
            ok: this.ok,
            message: this.message,
            details: this.details,
        });
    }
}
exports.ApiResponse = ApiResponse;
exports.resCode = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTED: 406,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
};
exports.errMsgEnum = {
    OK: "OK",
    CREATED: "Created",
    ACCEPTED: "Accepted",
    NO_CONTENT: "No Content",
    BAD_REQUEST: "Bad Request",
    UNAUTHORIZED: "Unauthorized",
    FORBIDDEN: "Forbidden",
    NOT_FOUND: "Not Found",
    METHOD_NOT_ALLOWED: "Method Not Allowed",
    NOT_ACCEPTED: "Not Accepted",
    CONFLICT: "Conflict",
    INTERNAL_SERVER_ERROR: "Internal Server Error",
    BAD_GATEWAY: "Bad Gateway",
    SERVICE_UNAVAILABLE: "Service Unavailable",
    GATEWAY_TIMEOUT: "Gateway Timeout",
};
exports.possiblePrismaError = {
    NOT_FOUND: "",
    ALREADY_EXISTS: "",
};
function errorController(error, req, res, next) {
    var _a, _b;
    console.log(error);
    if (error instanceof AppError)
        return res.status(error.statusCode).json({
            ok: false,
            error: { message: error.message, details: error.details },
        });
    if (error instanceof ValidationError)
        return res.status(error.statusCode).json({
            ok: false,
            error: { message: error.message, details: error.details },
        });
    if (error instanceof jsonwebtoken_1.JsonWebTokenError)
        return res.status(exports.resCode.UNAUTHORIZED).json({
            ok: false,
            error: {
                message: "Invalid API key",
                details: error,
            },
        });
    if (error instanceof library_1.PrismaClientKnownRequestError && error.code == "P2002")
        return res.status(exports.resCode.CONFLICT).json({
            ok: false,
            error: {
                message: `${(_b = (_a = error.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b[0]} already exists`,
                details: error,
            },
        });
    return res.status(exports.resCode.INTERNAL_SERVER_ERROR).json({
        ok: false,
        error: {
            message: "Something went wrong. Error: " + (error === null || error === void 0 ? void 0 : error.message),
            details: error,
        },
    });
}
exports.default = errorController;
const tryCatchWapper = (controller) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield controller(req, res);
    }
    catch (error) {
        return next(error);
    }
});
exports.tryCatchWapper = tryCatchWapper;
const middlewareWapper = (controller) => (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield controller(req, res, _next);
    }
    catch (error) {
        return _next(error);
    }
});
exports.middlewareWapper = middlewareWapper;
//# sourceMappingURL=response.controller.js.map