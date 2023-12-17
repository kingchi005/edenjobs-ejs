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
    }),
    appliyForJob: zod_1.z.object({
        job_id: (0, schema_1.getStringValidation)("job_id"),
        content: (0, schema_1.getStringValidation)("content"),
    }),
};
exports.default = ValidationSchema;
//# sourceMappingURL=input.validation.js.map