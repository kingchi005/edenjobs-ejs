import { number, string, z } from "zod";
import {
	dateSchema,
	getBooleanValidation,
	getOptionalStringValidation,
	getStringValidation,
} from "./schema";

const ValidationSchema = {
	login: z.object({
		identifier: getStringValidation("Email or username"),
		password: getStringValidation("password"),
	}),
	register: z.object({
		username: getStringValidation("username"),
		email: getStringValidation("email"),
		password: getStringValidation("password"),
		first_name: getStringValidation("first_name"),
		last_name: getStringValidation("last_name"),
		is_applicant: getBooleanValidation("is_applicant"),
		gender: getStringValidation("gender"),
		address: getStringValidation("address"),
		date_of_birth: dateSchema,
	}),
	appliyForJob: z.object({
		job_id: getStringValidation("job_id"),
		content: getStringValidation("content"),
	}),
	updateWorkDetails: z.object({
		job_field: getOptionalStringValidation("job_field"),
		qualifications: z
			.string({ invalid_type_error: `'qualifications' must be a JSON array` })
			.transform((v) => JSON.parse(v) as string[])
			.optional(),
		skill_set: z
			.string({ invalid_type_error: `'skill_set' must be a JSON array` })
			.transform((v) => JSON.parse(v) as string[])
			.optional(),
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
	avatar: z.object({
		avatar: z.custom<
			{
				path: string;
				type: `image/${"jpg" | "jpeg"}`;
			} & Omit<File, "type">
		>(),
	}),
} as const;

export default ValidationSchema;
// username=username&email=email&password=password&first_name=first_name&last_name=last_name&is_applicant=is_applicant&
