import { number, string, z } from "zod";
import {
	dateSchema,
	fileSchema,
	getBooleanValidation,
	getJsonArrayValidation,
	getNumberValidation,
	getOptionalStringValidation,
	getStringValidation,
	imageSchema,
} from "./schema";

const ValidationSchema = {
	login: z.object({
		identifier: getStringValidation("Email or username"),
		password: getStringValidation("password"),
	}),
	registerApplicantFile: z.object({
		avatar: imageSchema,
		cv_resume: fileSchema,
	}),
	registerApplicant: z.object({
		username: getStringValidation("username"),
		email: getStringValidation("email"),
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
		date_of_birth: dateSchema,
		// work details
		job_field: getStringValidation("job_field"),
		qualifications: getJsonArrayValidation("qualifications"),
		skill_set: getJsonArrayValidation("skill_set"),
		skill_level: getStringValidation("skill_level"),
		// job preferences
		years_of_experience: z
			.string({
				required_error: `'years_of_experience' is required`,
			})
			.refine((v) => !isNaN(+v), {
				message: "'years_of_experience' must be a number",
			})
			.transform((v) => +v), // ref from skill_level
		preferred_job_type: getStringValidation("preferred_job_type"),
		work_schedule: getStringValidation("work_schedule"),
		job_stability: getStringValidation("job_stability"),
		location_type: getStringValidation("location_type"),
		location: getStringValidation("location"), // ref from address
	}),
	registerEmployer: z.object({
		is_applicant: getBooleanValidation("is_applicant"),
		username: getStringValidation("username"),
		email: getStringValidation("email"),
		password: getStringValidation("password"),
		first_name: getStringValidation("first_name"),
		last_name: getStringValidation("last_name"),
		gender: getStringValidation("gender"),
		address: getStringValidation("address"),
		date_of_birth: dateSchema,
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
	/* 


	*/

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
