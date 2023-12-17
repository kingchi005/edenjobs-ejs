"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailSchema = exports.phoneNumberSchema = exports.getNumberValidation = exports.getOptionalStringValidation = exports.getStringValidation = exports.getBooleanValidation = exports.dateSchema = void 0;
const zod_1 = require("zod");
exports.dateSchema = zod_1.z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), {
    message: "Invalid date format",
})
    .refine((value) => {
    const date = new Date(value);
    const currentDate = new Date();
    return date > currentDate;
}, {
    message: "Date must be in the future",
})
    .transform((v) => new Date(v));
const getBooleanValidation = (v) => zod_1.z
    .enum(["true", "false"], {
    required_error: `'${v}' is required`,
})
    .transform((v) => v == "true");
exports.getBooleanValidation = getBooleanValidation;
const getStringValidation = (key) => zod_1.z
    .string({
    required_error: `'${key}' is required`,
    invalid_type_error: `'${key}' must be a string`,
})
    .min(3, { message: `'${key}' must be 3 or more characters` });
exports.getStringValidation = getStringValidation;
const getOptionalStringValidation = (key) => zod_1.z
    .string({
    invalid_type_error: `'${key}' must be a string`,
})
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