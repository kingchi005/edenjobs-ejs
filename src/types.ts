type IResponse = {
	ok: boolean;
};

export type ErrorResponse<T> = IResponse & {
	error: {
		message: string;
		details?: T;
	};
};

export type SuccessResponse<T> = IResponse & {
	message?: string;
	data?: T;
};

export type TUser = {
	id: string;
	username: string;
	email: string;
	first_name: string;
	last_name: string;
	password: string;
	is_applicant: boolean | null;
	applicant_id: string | null;
	employer_id: string | null;
	created_at: Date;
	updated_at: Date;
};
