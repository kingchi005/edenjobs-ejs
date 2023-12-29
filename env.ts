import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
	DATABASE_URL: z.string(),
	// PORT: z.string(),
	// BASE_URL: z.string(),
	// DEV_ENV: z.string(),
	HASH_SECRET: z.string(),
	AUTH_COOKIE: z.string(),
	// PAYSTACK_SECRET_KEY: z.string(),
	CLOUDINARY_API_KEY: z.string(),
	CLOUDINARY_CLOUD_NAME: z.string(),
	CLOUDINARY_API_SECRET: z.string(),
	CURRENT_ENV: z.string(),
	// MAIL_USER: z.string(),
	// MAIL_PASSWORD: z.string(),
	// MAIL_HOST: z.string(),
	// MAIL_PORT: z.string(),
	// CORS_ORIGIN: z.string(),
});

const runtimeEnv = {
	AUTH_COOKIE: "@authed",
};

const env = envSchema.parse({ ...process.env, ...runtimeEnv });

export default env;
