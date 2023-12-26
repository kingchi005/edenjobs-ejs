import { z } from "zod";
import {
	dateSchema,
	getBooleanValidation,
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
		date_of_birth: dateSchema,
	}),
	appliyForJob: z.object({
		job_id: getStringValidation("job_id"),
		content: getStringValidation("content"),
	}),
	// register:z.object({}),
	// register:z.object({}),
	// register:z.object({}),
	// register:z.object({}),
	// register:z.object({}),
	// register:z.object({}),
} as const;

export default ValidationSchema;
// username=username&email=email&password=password&first_name=first_name&last_name=last_name&is_applicant=is_applicant&
