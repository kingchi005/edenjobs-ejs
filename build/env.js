"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string(),
    HASH_SECRET: zod_1.z.string(),
    AUTH_COOKIE: zod_1.z.string(),
    CLOUDINARY_API_KEY: zod_1.z.string(),
    CLOUDINARY_CLOUD_NAME: zod_1.z.string(),
    CLOUDINARY_API_SECRET: zod_1.z.string(),
    CURRENT_ENV: zod_1.z.string(),
});
const runtimeEnv = {
    AUTH_COOKIE: "@authed",
};
const env = envSchema.parse(Object.assign(Object.assign({}, process.env), runtimeEnv));
exports.default = env;
//# sourceMappingURL=env.js.map