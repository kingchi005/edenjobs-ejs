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
exports.isJsonArray = exports.hasExpired = exports.isValidToken = exports.formatDate = exports.validateDateRange = exports.isValidBase64 = exports.findIndexContainingString = exports.uploadFile = void 0;
const cloudinary_1 = require("cloudinary");
const env_1 = __importDefault(require("../../env"));
cloudinary_1.v2.config({
    cloud_name: env_1.default.CLOUDINARY_CLOUD_NAME,
    api_key: env_1.default.CLOUDINARY_API_KEY,
    api_secret: env_1.default.CLOUDINARY_API_SECRET,
});
const uploadFile = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary_1.v2.uploader.upload(filePath, {
            use_filename: true,
            unique_filename: true,
            overwrite: true,
            resource_type: "auto",
            invalidate: true,
        });
        return result;
    }
    catch (error) {
        return { error };
    }
});
exports.uploadFile = uploadFile;
function findIndexContainingString(arr, searchString) {
    return arr.findIndex(function (item) {
        return item.includes(searchString);
    });
}
exports.findIndexContainingString = findIndexContainingString;
function isValidBase64(str) {
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    return base64Regex.test(str);
}
exports.isValidBase64 = isValidBase64;
function validateDateRange(startDate, endDate) {
    return startDate.getTime() < endDate.getTime();
}
exports.validateDateRange = validateDateRange;
const formatDate = (date, future = false) => {
    const prefix = future ? "" : " ago";
    const now = new Date();
    const diffInMs = future
        ? new Date(date).getTime() - now.getTime()
        : now.getTime() - new Date(date).getTime();
    const diffInSecs = Math.floor(diffInMs / 1000);
    const diffInMins = Math.floor(diffInSecs / 60);
    const diffInHrs = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHrs / 24);
    if (diffInSecs < 4) {
        return "just now";
    }
    else if (diffInSecs < 60) {
        return diffInSecs + ` secs${prefix}`;
    }
    else if (diffInMins < 60) {
        return diffInMins + ` min${prefix}`;
    }
    else if (diffInHrs < 24) {
        return diffInHrs + ` hrs${prefix}`;
    }
    else if (diffInDays === 1) {
        return "yesterday";
    }
    else if (diffInDays < 90) {
        return diffInDays + ` days${prefix}`;
    }
    else {
        return new Date(date).toLocaleDateString();
    }
};
exports.formatDate = formatDate;
const isValidToken = (obj) => obj !== null && typeof obj == "object" && "id" in obj;
exports.isValidToken = isValidToken;
const hasExpired = (exp) => exp * 1000 < new Date().getTime();
exports.hasExpired = hasExpired;
const isJsonArray = (str) => {
    try {
        return Array.isArray(JSON.parse(str));
    }
    catch (error) {
        return false;
    }
};
exports.isJsonArray = isJsonArray;
//# sourceMappingURL=helpers.controller.js.map