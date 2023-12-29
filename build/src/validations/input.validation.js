"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const schema_1 = require("./schema");
const ValidationSchema = {
    login: zod_1.z.object({
        identifier: (0, schema_1.getStringValidation)("Email or username"),
        password: (0, schema_1.getStringValidation)("password"),
    }),
    register: zod_1.z.object({
        username: (0, schema_1.getStringValidation)("username"),
        email: (0, schema_1.getStringValidation)("email"),
        password: (0, schema_1.getStringValidation)("password"),
        first_name: (0, schema_1.getStringValidation)("first_name"),
        last_name: (0, schema_1.getStringValidation)("last_name"),
        is_applicant: (0, schema_1.getBooleanValidation)("is_applicant"),
        gender: (0, schema_1.getStringValidation)("gender"),
        address: (0, schema_1.getStringValidation)("address"),
        date_of_birth: schema_1.dateSchema,
    }),
    appliyForJob: zod_1.z.object({
        job_id: (0, schema_1.getStringValidation)("job_id"),
        content: (0, schema_1.getStringValidation)("content"),
    }),
    updateWorkDetails: zod_1.z.object({
        job_field: (0, schema_1.getOptionalStringValidation)("job_field"),
        qualifications: zod_1.z
            .string({ invalid_type_error: `'qualifications' must be a JSON array` })
            .transform((v) => JSON.parse(v))
            .optional(),
        skill_set: zod_1.z
            .string({ invalid_type_error: `'skill_set' must be a JSON array` })
            .transform((v) => JSON.parse(v))
            .optional(),
        skill_level: (0, schema_1.getOptionalStringValidation)("skill_level"),
    }),
    updateJobPreferences: zod_1.z.object({
        Job_location: (0, schema_1.getOptionalStringValidation)("Job_location"),
        work_schedule: (0, schema_1.getOptionalStringValidation)("work_schedule"),
        job_type: (0, schema_1.getOptionalStringValidation)("job_type"),
    }),
    updatePersonalDetails: zod_1.z.object({
        first_name: (0, schema_1.getOptionalStringValidation)("first_name"),
        last_name: (0, schema_1.getOptionalStringValidation)("last_name"),
        address: (0, schema_1.getOptionalStringValidation)("address"),
    }),
    avatar: zod_1.z.object({
        avatar: zod_1.z.custom(),
    }),
};
exports.default = ValidationSchema;
//# sourceMappingURL=input.validation.js.map