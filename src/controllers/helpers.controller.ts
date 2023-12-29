import { v2 as cloudinary } from "cloudinary";
import env from "../../env";
import jwt from "jsonwebtoken";

cloudinary.config({
	cloud_name: env.CLOUDINARY_CLOUD_NAME,
	api_key: env.CLOUDINARY_API_KEY,
	api_secret: env.CLOUDINARY_API_SECRET,
});

export const uploadFile = async (filePath: string) => {
	try {
		// Upload the image
		const result = await cloudinary.uploader.upload(filePath, {
			use_filename: true,
			unique_filename: true,
			overwrite: true,
			resource_type: "auto",
			invalidate: true,
		});
		// console.log(result);
		return result;
	} catch (error) {
		// console.log(error)
		return { error };
	}
};

/* export const regNo = (username: string) => {
	const year = new Date().getFullYear();
	const month = new Date().getMonth() + 1;
	const randomCode = Math.floor(Math.random() * 999999)
		.toString()
		.padStart(6, "0");

	return `${username
		.slice(0, 3)
		.toLocaleUpperCase()}${randomCode}${month}${year}`;
}; */

export function findIndexContainingString(arr: any[], searchString: string) {
	return arr.findIndex(function (item) {
		return item.includes(searchString);
	});
}

export function isValidBase64(str: string) {
	const base64Regex = /^[A-Za-z0-9+/=]+$/;
	return base64Regex.test(str);
}

export function validateDateRange(startDate: Date, endDate: Date) {
	return startDate.getTime() < endDate.getTime();
}

export const formatDate = (date: string, future: boolean = false) => {
	const prefix = future ? "" : " ago";
	const now = new Date();
	const diffInMs = future
		? new Date(date).getTime() - now.getTime()
		: now.getTime() - new Date(date).getTime();

	const diffInSecs = Math.floor(diffInMs / 1000);
	const diffInMins = Math.floor(diffInSecs / 60);
	const diffInHrs = Math.floor(diffInMins / 60);
	const diffInDays = Math.floor(diffInHrs / 24);

	if (diffInSecs < 4) {
		return "just now";
	} else if (diffInSecs < 60) {
		return diffInSecs + ` secs${prefix}`;
	} else if (diffInMins < 60) {
		return diffInMins + ` min${prefix}`;
	} else if (diffInHrs < 24) {
		return diffInHrs + ` hrs${prefix}`;
	} else if (diffInDays === 1) {
		return "yesterday";
	} else if (diffInDays < 90) {
		return diffInDays + ` days${prefix}`;
	} else {
		return new Date(date).toLocaleDateString();
	}
};

export const isValidToken = (
	obj: unknown
): obj is { id: string } & jwt.JwtPayload =>
	obj !== null && typeof obj == "object" && "id" in obj;

export const hasExpired = (exp: number) => exp * 1000 < new Date().getTime();

export const isJsonArray = (str: string) => {
	try {
		return Array.isArray(JSON.parse(str));
	} catch (error) {
		return false;
	}
};
