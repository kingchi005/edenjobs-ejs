"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const schema_1 = require("./schema");
const date_of_birth = schema_1.dateSchema.refine((value) => {
    const date = new Date(value);
    const now = new Date();
    return date < now;
}, {
    message: "Date must be in the past",
});
const ValidationSchema = {
    login: zod_1.z.object({
        identifier: (0, schema_1.getStringValidation)("Email or username"),
        password: (0, schema_1.getStringValidation)("password"),
    }),
    registerApplicantFile: zod_1.z.object({
        avatar: schema_1.imageSchema,
        cv_resume: schema_1.fileSchema,
    }),
    createJob: zod_1.z.object({
        title: (0, schema_1.getStringValidation)("title"),
        category_id: (0, schema_1.getStrNumValidation)("category_id"),
        employment_type: (0, schema_1.getStringValidation)("employment_type"),
        job_location: (0, schema_1.getStringValidation)("job_location"),
        min_quaification: (0, schema_1.getStringValidation)("min_quaification"),
        experience_level: (0, schema_1.getStringValidation)("experience_level"),
        expires_at: schema_1.dateSchema.refine((value) => {
            const date = new Date(value);
            const now = new Date();
            return date > now;
        }, {
            message: "Date must be in the future",
        }),
        state_location: (0, schema_1.getStringValidation)("state_location"),
        city_location: (0, schema_1.getStringValidation)("city_location"),
        min_salary: (0, schema_1.getStrNumValidation)("min_salary"),
        max_salary: (0, schema_1.getStrNumValidation)("max_salary"),
        salary_period: (0, schema_1.getStringValidation)("salary_period"),
        summary: (0, schema_1.getStringValidation)("summary"),
        description_and_requirement: (0, schema_1.getStringValidation)("description_and_requirement"),
    }),
    editJob: zod_1.z.object({
        title: (0, schema_1.getOptionalStringValidation)("title"),
        category_id: (0, schema_1.getStrNumValidation)("category_id"),
        employment_type: (0, schema_1.getOptionalStringValidation)("employment_type"),
        job_location: (0, schema_1.getOptionalStringValidation)("job_location"),
        min_quaification: (0, schema_1.getOptionalStringValidation)("min_quaification"),
        experience_level: (0, schema_1.getOptionalStringValidation)("experience_level"),
        expires_at: schema_1.dateSchema
            .refine((value) => {
            const date = new Date(value);
            const now = new Date();
            return date > now;
        }, {
            message: "Date must be in the future",
        })
            .optional(),
        state_location: (0, schema_1.getOptionalStringValidation)("state_location"),
        city_location: (0, schema_1.getOptionalStringValidation)("city_location"),
        min_salary: (0, schema_1.getStrNumValidation)("min_salary"),
        max_salary: (0, schema_1.getStrNumValidation)("max_salary"),
        salary_period: (0, schema_1.getOptionalStringValidation)("salary_period"),
        summary: (0, schema_1.getOptionalStringValidation)("summary"),
        description_and_requirement: (0, schema_1.getOptionalStringValidation)("description_and_requirement"),
    }),
    registerApplicant: zod_1.z.object({
        username: (0, schema_1.getStringValidation)("username"),
        email: (0, schema_1.getStringValidation)("email").transform((v) => v.toLocaleLowerCase()),
        password: (0, schema_1.getStringValidation)("password"),
        first_name: (0, schema_1.getStringValidation)("first_name"),
        last_name: (0, schema_1.getStringValidation)("last_name"),
        gender: zod_1.z
            .string({
            required_error: `'gender' is required`,
            invalid_type_error: `'gender' must be a string`,
        })
            .min(1, { message: `'gender' is required` }),
        address: (0, schema_1.getStringValidation)("address"),
        date_of_birth,
        job_field: (0, schema_1.getStringValidation)("job_field"),
        qualifications: (0, schema_1.getJsonArrayValidation)("qualifications"),
        skill_set: (0, schema_1.getJsonArrayValidation)("skill_set"),
        skill_level: (0, schema_1.getStringValidation)("skill_level"),
        years_of_experience: (0, schema_1.getStrNumValidation)("years_of_experience-"),
        preferred_job_type: (0, schema_1.getStringValidation)("preferred_job_type"),
        work_schedule: (0, schema_1.getStringValidation)("work_schedule"),
        job_stability: (0, schema_1.getStringValidation)("job_stability"),
        location_type: (0, schema_1.getStringValidation)("location_type"),
        location: (0, schema_1.getStringValidation)("location"),
    }),
    registerEmployer: zod_1.z.object({
        is_applicant: (0, schema_1.getBooleanValidation)("is_applicant"),
        username: (0, schema_1.getStringValidation)("username"),
        email: (0, schema_1.getStringValidation)("email").transform((v) => v.toLocaleLowerCase()),
        password: (0, schema_1.getStringValidation)("password"),
        first_name: (0, schema_1.getStringValidation)("first_name"),
        last_name: (0, schema_1.getStringValidation)("last_name"),
        gender: (0, schema_1.getStringValidation)("gender"),
        address: (0, schema_1.getStringValidation)("address"),
        date_of_birth,
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
    updateCompanyDetails: zod_1.z.object({
        company_name: (0, schema_1.getOptionalStringValidation)("company_name"),
        company_email: (0, schema_1.getOptionalStringValidation)("company_email"),
        company_description: (0, schema_1.getOptionalStringValidation)("company_description"),
        company_location_state: (0, schema_1.getOptionalStringValidation)("company_location_state"),
        company_location_city: (0, schema_1.getOptionalStringValidation)("company_location_city"),
        company_location_street: (0, schema_1.getOptionalStringValidation)("company_location_street"),
        company_logo: (0, schema_1.getOptionalStringValidation)("company_logo"),
        company_website: (0, schema_1.getOptionalStringValidation)("company_website"),
        company_size: (0, schema_1.getOptionalStringValidation)("company_size"),
        industry: (0, schema_1.getOptionalStringValidation)("industry"),
        culture: (0, schema_1.getJsonArrayValidation)("culture"),
    }),
};
exports.default = ValidationSchema;
//# sourceMappingURL=input.validation.js.map