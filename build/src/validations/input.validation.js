"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const schema_1 = require("./schema");
const ValidationSchema = {
    login: zod_1.z.object({
        identifier: (0, schema_1.getStringValidation)("Email or username"),
        password: (0, schema_1.getStringValidation)("password"),
    }),
    registerApplicant: zod_1.z.object({
        is_applicant: (0, schema_1.getBooleanValidation)("is_applicant"),
        username: (0, schema_1.getStringValidation)("username"),
        email: (0, schema_1.getStringValidation)("email"),
        password: (0, schema_1.getStringValidation)("password"),
        first_name: (0, schema_1.getStringValidation)("first_name"),
        last_name: (0, schema_1.getStringValidation)("last_name"),
        gender: (0, schema_1.getStringValidation)("gender"),
        address: (0, schema_1.getStringValidation)("address"),
        date_of_birth: schema_1.dateSchema,
        applicant_details: zod_1.z.object({
            avatar: schema_1.imageSchema,
            cv_resume_url: schema_1.fileSchema,
            job_field: (0, schema_1.getStringValidation)("job_field"),
            qualifications: (0, schema_1.getJsonArrayValidation)("qualifications"),
            skill_set: (0, schema_1.getJsonArrayValidation)("skill_set"),
            skill_level: (0, schema_1.getStringValidation)("skill_level"),
            years_of_experience: (0, schema_1.getNumberValidation)("years_of_experience"),
            preferred_job_type: (0, schema_1.getStringValidation)("preferred_job_type"),
            work_schedule: (0, schema_1.getStringValidation)("work_schedule"),
            job_stability: (0, schema_1.getStringValidation)("job_stability"),
            location_type: (0, schema_1.getStringValidation)("location_type"),
            location: (0, schema_1.getStringValidation)("location"),
        }),
    }),
    registerEmployer: zod_1.z.object({
        is_applicant: (0, schema_1.getBooleanValidation)("is_applicant"),
        username: (0, schema_1.getStringValidation)("username"),
        email: (0, schema_1.getStringValidation)("email"),
        password: (0, schema_1.getStringValidation)("password"),
        first_name: (0, schema_1.getStringValidation)("first_name"),
        last_name: (0, schema_1.getStringValidation)("last_name"),
        gender: (0, schema_1.getStringValidation)("gender"),
        address: (0, schema_1.getStringValidation)("address"),
        date_of_birth: schema_1.dateSchema,
        applicant_details: zod_1.z.object({
            avatar: schema_1.imageSchema,
            cv_resume_url: schema_1.fileSchema,
            job_field: (0, schema_1.getStringValidation)("job_field"),
            qualifications: (0, schema_1.getJsonArrayValidation)("qualifications"),
            skill_set: (0, schema_1.getJsonArrayValidation)("skill_set"),
            skill_level: (0, schema_1.getStringValidation)("skill_level"),
            years_of_experience: (0, schema_1.getNumberValidation)("years_of_experience"),
            preferred_job_type: (0, schema_1.getStringValidation)("preferred_job_type"),
            work_schedule: (0, schema_1.getStringValidation)("work_schedule"),
            job_stability: (0, schema_1.getStringValidation)("job_stability"),
            location_type: (0, schema_1.getStringValidation)("location_type"),
            location: (0, schema_1.getStringValidation)("location"),
        }),
    }),
    appliyForJob: zod_1.z.object({
        job_id: (0, schema_1.getStringValidation)("job_id"),
        content: (0, schema_1.getStringValidation)("content"),
    }),
    updateWorkDetails: zod_1.z.object({
        job_field: (0, schema_1.getOptionalStringValidation)("job_field"),
        qualifications: (0, schema_1.getJsonArrayValidation)("qualifications").optional(),
        skill_set: (0, schema_1.getJsonArrayValidation)("skill_set").optional(),
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
    image: schema_1.imageSchema,
    cv_resumeSchema: schema_1.fileSchema,
};
exports.default = ValidationSchema;
//# sourceMappingURL=input.validation.js.map