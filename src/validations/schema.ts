import { z } from "zod";

export const dateSchema = z
	.string()
	.refine((value) => !isNaN(Date.parse(value)), {
		message: "Invalid date format",
	})
	.refine(
		(value) => {
			const date = new Date(value);
			const currentDate = new Date();
			return date > currentDate;
		},
		{
			message: "Date must be in the future",
		}
	)
	.transform((v) => new Date(v));

export const getBooleanValidation = (v: string) =>
	z
		.enum(["true", "false"], {
			required_error: `'${v}' is required`,
		})
		.transform((v) => v == "true");

export const getStringValidation = (key: string) =>
	z
		.string({
			required_error: `'${key}' is required`,
			invalid_type_error: `'${key}' must be a string`,
		})
		.min(3, { message: `'${key}' must be 3 or more characters` });

export const getOptionalStringValidation = (key: string) =>
	z
		.string({
			invalid_type_error: `'${key}' must be a string`,
		})
		.optional();

export const getNumberValidation = (key: string) =>
	z.number({
		required_error: `'${key}' is required`,
		invalid_type_error: `'${key}' must be a number`,
	});

export const phoneNumberSchema = z
	.string()
	.regex(/^\+(?:[0-9] ?){6,14}[0-9]$/, { message: "Invalid phone number" })
	.min(7, { message: "Invalid phone number" })
	.max(14, { message: "Invalid phone number" })
	.transform((v) => v.replace(/\s/g, ""));

export const emailSchema = z
	.string({ required_error: "Email is required" })
	.email({ message: "Provide a valid email" });

//
