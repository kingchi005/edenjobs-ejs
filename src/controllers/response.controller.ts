import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../types";
import { JsonWebTokenError } from "jsonwebtoken";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError, z } from "zod";

export class AppError extends Error {
	constructor(
		public message: string,
		public statusCode: number,
		public details?: unknown
	) {
		super(message);
	}
}

/* 
	if (!safeInput.success)
		throw new AppError(
			safeInput.error.issues.map((d) => d.message).join(", "),
			resCode.BAD_REQUEST,
			safeInput.error
		);
*/

export class ValidationError extends Error {
	public statusCode: number = resCode.BAD_REQUEST;
	public details?: unknown;
	constructor(public error: ZodError<any>) {
		super(error.issues.map((d) => d.message).join(", "));
		this.details = error;
	}
}

export class ApiResponse {
	constructor(
		private res: Response,
		public message: string,
		public details?: unknown,
		public statusCode: number = resCode.OK,
		public ok: boolean = true
	) {}

	public send() {
		return this.res.status(this.statusCode).json({
			ok: this.ok,
			message: this.message,
			details: this.details,
		});
	}
}

export const resCode = {
	OK: 200,
	CREATED: 201,
	ACCEPTED: 202,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	METHOD_NOT_ALLOWED: 405,
	NOT_ACCEPTED: 406,
	CONFLICT: 409,
	INTERNAL_SERVER_ERROR: 500,
	BAD_GATEWAY: 502,
	SERVICE_UNAVAILABLE: 503,
	GATEWAY_TIMEOUT: 504,
} as const;

export const errMsgEnum = {
	OK: "OK",
	CREATED: "Created",
	ACCEPTED: "Accepted",
	NO_CONTENT: "No Content",
	BAD_REQUEST: "Bad Request",
	UNAUTHORIZED: "Unauthorized",
	FORBIDDEN: "Forbidden",
	NOT_FOUND: "Not Found",
	METHOD_NOT_ALLOWED: "Method Not Allowed",
	NOT_ACCEPTED: "Not Accepted",
	CONFLICT: "Conflict",
	INTERNAL_SERVER_ERROR: "Internal Server Error",
	BAD_GATEWAY: "Bad Gateway",
	SERVICE_UNAVAILABLE: "Service Unavailable",
	GATEWAY_TIMEOUT: "Gateway Timeout",
} as const;

export const possiblePrismaError = {
	NOT_FOUND: "",
	ALREADY_EXISTS: "",
} as const;

export default function errorController(
	error: any,
	req: Request,
	res: Response,
	next: NextFunction
) {
	console.log(error);
	if (error instanceof AppError)
		return res.status(error.statusCode).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: error.message, details: error.details },
		});

	if (error instanceof ValidationError)
		return res.status(error.statusCode).json(<ErrorResponse<any>>{
			ok: false,
			error: { message: error.message, details: error.details },
		});

	if (error instanceof JsonWebTokenError)
		return res.status(resCode.UNAUTHORIZED).json(<ErrorResponse<typeof error>>{
			ok: false,
			error: {
				message: "Invalid API key",
				details: error,
			},
		});

	if (error instanceof PrismaClientKnownRequestError && error.code == "P2002")
		return res.status(resCode.CONFLICT).json(<ErrorResponse<typeof error>>{
			ok: false,
			error: {
				message: `${(error.meta?.target as string[])?.[0]} already exists`,
				details: error,
			},
		});

	return res.status(resCode.INTERNAL_SERVER_ERROR).json(<ErrorResponse<any>>{
		ok: false,
		error: {
			message: "Something went wrong. Error: " + error?.message,
			details: error,
		},
	});
}

export const tryCatchWapper =
	(controller: (req: Request, res: Response) => Promise<any>) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await controller(req, res);
		} catch (error) {
			return next(error);
		}
	};

export const middlewareWapper =
	(
		controller: (
			req: Request,
			res: Response,
			next: NextFunction
		) => Promise<any>
	) =>
	async (req: Request, res: Response, _next: NextFunction) => {
		try {
			await controller(req, res, _next);
		} catch (error) {
			return _next(error);
		}
	};
