import { number, string, z } from "zod";
import {
	dateSchema,
	fileSchema,
	getBooleanValidation,
	getJsonArrayValidation,
	getNumberValidation,
	getOptionalStringValidation,
	getStrNumValidation,
	getStringValidation,
	imageSchema,
} from "./schema";

const date_of_birth = dateSchema.refine(
	(value) => {
		const date = new Date(value);
		const now = new Date();
		return date < now;
	},
	{
		message: "Date must be in the past",
	}
);
const ValidationSchema = {
	login: z.object({
		identifier: getStringValidation("Email or username"),
		password: getStringValidation("password"),
	}),
	registerApplicantFile: z.object({
		avatar: imageSchema,
		cv_resume: fileSchema,
	}),
	createJob: z.object({
		title: getStringValidation("title"),
		category_id: getStrNumValidation("category_id"),
		employment_type: getStringValidation("employment_type"),
		job_location: getStringValidation("job_location"),
		min_quaification: getStringValidation("min_quaification"),
		experience_level: getStringValidation("experience_level"),
		expires_at: dateSchema.refine(
			(value) => {
				const date = new Date(value);
				const now = new Date();
				return date > now;
			},
			{
				message: "Date must be in the future",
			}
		),
		state_location: getStringValidation("state_location"),
		city_location: getStringValidation("city_location"),
		min_salary: getStrNumValidation("min_salary"),
		max_salary: getStrNumValidation("max_salary"),
		salary_period: getStringValidation("salary_period"),
		summary: getStringValidation("summary"),
		description_and_requirement: getStringValidation(
			"description_and_requirement"
		),
	}),
	editJob: z.object({
		title: getOptionalStringValidation("title"),
		category_id: getStrNumValidation("category_id"),
		employment_type: getOptionalStringValidation("employment_type"),
		job_location: getOptionalStringValidation("job_location"),
		min_quaification: getOptionalStringValidation("min_quaification"),
		experience_level: getOptionalStringValidation("experience_level"),
		expires_at: dateSchema
			.refine(
				(value) => {
					const date = new Date(value);
					const now = new Date();
					return date > now;
				},
				{
					message: "Date must be in the future",
				}
			)
			.optional(),
		state_location: getOptionalStringValidation("state_location"),
		city_location: getOptionalStringValidation("city_location"),
		min_salary: getStrNumValidation("min_salary"),
		max_salary: getStrNumValidation("max_salary"),
		salary_period: getOptionalStringValidation("salary_period"),
		summary: getOptionalStringValidation("summary"),
		description_and_requirement: getOptionalStringValidation(
			"description_and_requirement"
		),
	}),
	registerApplicant: z.object({
		username: getStringValidation("username"),
		email: getStringValidation("email").transform((v) => v.toLocaleLowerCase()),
		password: getStringValidation("password"),
		first_name: getStringValidation("first_name"),
		last_name: getStringValidation("last_name"),
		gender: z
			.string({
				required_error: `'gender' is required`,
				invalid_type_error: `'gender' must be a string`,
			})
			.min(1, { message: `'gender' is required` }),
		address: getStringValidation("address"),
		date_of_birth,
		// work details
		job_field: getStringValidation("job_field"),
		qualifications: getJsonArrayValidation("qualifications"),
		skill_set: getJsonArrayValidation("skill_set"),
		skill_level: getStringValidation("skill_level"),
		// job preferences
		years_of_experience: getStrNumValidation("years_of_experience-"),
		preferred_job_type: getStringValidation("preferred_job_type"),
		work_schedule: getStringValidation("work_schedule"),
		job_stability: getStringValidation("job_stability"),
		location_type: getStringValidation("location_type"),
		location: getStringValidation("location"), // ref from address
	}),
	registerEmployer: z.object({
		is_applicant: getBooleanValidation("is_applicant"),
		username: getStringValidation("username"),
		email: getStringValidation("email").transform((v) => v.toLocaleLowerCase()),
		password: getStringValidation("password"),
		first_name: getStringValidation("first_name"),
		last_name: getStringValidation("last_name"),
		gender: getStringValidation("gender"),
		address: getStringValidation("address"),
		date_of_birth,
		applicant_details: z.object({
			// work details
			avatar: imageSchema,
			cv_resume_url: fileSchema,
			job_field: getStringValidation("job_field"),
			qualifications: getJsonArrayValidation("qualifications"),
			skill_set: getJsonArrayValidation("skill_set"),
			skill_level: getStringValidation("skill_level"),
			// job preferences
			years_of_experience: getNumberValidation("years_of_experience"), // ref from skill_level
			preferred_job_type: getStringValidation("preferred_job_type"),
			work_schedule: getStringValidation("work_schedule"),
			job_stability: getStringValidation("job_stability"),
			location_type: getStringValidation("location_type"),
			location: getStringValidation("location"), // ref from address
		}),
	}),
	appliyForJob: z.object({
		job_id: getStringValidation("job_id"),
		content: getStringValidation("content"),
	}),
	updateWorkDetails: z.object({
		job_field: getOptionalStringValidation("job_field"),
		qualifications: getJsonArrayValidation("qualifications").optional(),
		skill_set: getJsonArrayValidation("skill_set").optional(),
		skill_level: getOptionalStringValidation("skill_level"),
	}),
	updateJobPreferences: z.object({
		Job_location: getOptionalStringValidation("Job_location"),
		work_schedule: getOptionalStringValidation("work_schedule"),
		job_type: getOptionalStringValidation("job_type"),
	}),
	updatePersonalDetails: z.object({
		first_name: getOptionalStringValidation("first_name"),
		last_name: getOptionalStringValidation("last_name"),
		address: getOptionalStringValidation("address"),
	}),
	image: imageSchema,

	cv_resumeSchema: fileSchema,

	updateCompanyDetails: z.object({
		company_name: getOptionalStringValidation("company_name"),
		company_email: getOptionalStringValidation("company_email"),
		company_description: getOptionalStringValidation("company_description"),
		company_location_state: getOptionalStringValidation(
			"company_location_state"
		),
		company_location_city: getOptionalStringValidation("company_location_city"),
		company_location_street: getOptionalStringValidation(
			"company_location_street"
		),
		company_logo: getOptionalStringValidation("company_logo"),
		company_website: getOptionalStringValidation("company_website"),
		company_size: getOptionalStringValidation("company_size"),
		industry: getOptionalStringValidation("industry"),
		culture: getJsonArrayValidation("culture"),
	}),
} as const;

export default ValidationSchema;
// username=username&email=email&password=password&first_name=first_name&last_name=last_name&is_applicant=is_applicant&
