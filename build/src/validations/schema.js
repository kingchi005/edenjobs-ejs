"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailSchema = exports.phoneNumberSchema = exports.getNumberValidation = exports.getOptionalStringValidation = exports.getStrNumValidation = exports.getStringValidation = exports.getJsonArrayValidation = exports.getBooleanValidation = exports.fileSchema = exports.imageSchema = exports.dateSchema = void 0;
const zod_1 = require("zod");
const helpers_controller_1 = require("../controllers/helpers.controller");
exports.dateSchema = zod_1.z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), {
    message: "Invalid date format",
})
    .transform((v) => new Date(v));
exports.imageSchema = zod_1.z.custom();
exports.fileSchema = zod_1.z.custom();
const getBooleanValidation = (v) => zod_1.z
    .enum(["true", "false"], {
    required_error: `'${v}' is required`,
})
    .transform((v) => v == "true");
exports.getBooleanValidation = getBooleanValidation;
const getJsonArrayValidation = (key) => zod_1.z
    .string({ required_error: `'${key}' is required` })
    .refine((value) => (0, helpers_controller_1.isJsonArray)(value), {
    message: `'${key}' must be a JSON array`,
});
exports.getJsonArrayValidation = getJsonArrayValidation;
const getStringValidation = (key) => zod_1.z
    .string({
    required_error: `'${key}' is required`,
    invalid_type_error: `'${key}' must be a string`,
})
    .min(3, { message: `'${key}' must be 3 or more characters` });
exports.getStringValidation = getStringValidation;
const getStrNumValidation = (key) => zod_1.z
    .string({
    required_error: `'${key}' is required`,
})
    .refine((v) => !isNaN(+v), {
    message: `'${key}' must be a number`,
})
    .transform((v) => +v);
exports.getStrNumValidation = getStrNumValidation;
const getOptionalStringValidation = (key) => zod_1.z
    .string({
    invalid_type_error: `'${key}' must be a string`,
})
    .min(3, { message: `'${key}' must be 3 or more characters` })
    .optional();
exports.getOptionalStringValidation = getOptionalStringValidation;
const getNumberValidation = (key) => zod_1.z.number({
    required_error: `'${key}' is required`,
    invalid_type_error: `'${key}' must be a number`,
});
exports.getNumberValidation = getNumberValidation;
exports.phoneNumberSchema = zod_1.z
    .string()
    .regex(/^\+(?:[0-9] ?){6,14}[0-9]$/, { message: "Invalid phone number" })
    .min(7, { message: "Invalid phone number" })
    .max(14, { message: "Invalid phone number" })
    .transform((v) => v.replace(/\s/g, ""));
exports.emailSchema = zod_1.z
    .string({ required_error: "Email is required" })
    .email({ message: "Provide a valid email" });
//# sourceMappingURL=schema.js.map