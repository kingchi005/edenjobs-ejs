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

export interface Main {
	ok: boolean;
	message: string;
	details: Details;
}

export interface Details {
	jobs: Job[];
}

export interface Job {
	id: string;
	title: string;
	employment_type: EmploymentType;
	summary: string;
	description_and_requirement: string;
	min_quaification: MinQuaification;
	is_remote: boolean;
	city_location: string;
	state_location: string;
	benefits: Benefits;
	expires_at: Date;
	required_experience_years: number;
	experience_level: ExperienceLevel;
	required_skills: RequiredSkills;
	min_salary: number;
	max_salary: number;
	salary_period: SalaryPeriod;
	responsibilities: Responsibilities;
	category_id: number;
	publisher_id: PublisherID;
	published_at: Date;
	created_at: Date;
	updated_at: Date;
}

export enum Benefits {
	GoodThingsLoveJoyFantaEtc = "good things|love|joy|fanta|etc",
}

export enum EmploymentType {
	Contract = "contract",
	FullTime = "full-time",
	PartTime = "part-time",
}

export enum ExperienceLevel {
	AdvanceLevel = "advance-level",
	EntryLevel = "entry-level",
	MidLevel = "mid-level",
}

export enum MinQuaification {
	BSc = "B. Sc",
	BTech = "B. Tech",
	Masters = "Masters",
	Phd = "Phd",
	Prof = "Prof",
}

export enum PublisherID {
	Clq4Ae8Ew00013805Ku6Aee12 = "clq4ae8ew00013805ku6aee12",
	Clq4Ae8Ji00033805Jll0Twzh = "clq4ae8ji00033805jll0twzh",
	Clq4Ae8Sy00073805N411Kpb0 = "clq4ae8sy00073805n411kpb0",
	Clq4Ae8X4000938057C49O390 = "clq4ae8x4000938057c49o390",
}

export enum RequiredSkills {
	CookingFightingGiveingLifeToChristAndSoOn = "cooking|fighting|giveing life to christ|and so on",
}

export enum Responsibilities {
	ComeGoCheckDoYourJobChop = "come|go|check|do your job|chop",
}

export enum SalaryPeriod {
	BIWeekly = "bi-weekly",
	Monthly = "monthly",
	Weekly = "weekly",
	Yearly = "yearly",
}
