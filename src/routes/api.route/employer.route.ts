import { Router, Request, Response } from "express";
import {
	handlerWapper,
	middlewareWapper,
} from "../../controllers/response.controller";
import {
	onlyAuthenticated,
	onlyEmployers,
} from "../../controllers/middleware.controller";
import {
	updateCompanyDetails,
	updateCompanyLogo,
} from "../../controllers/employer.controller";
import { updatePersonalDetails } from "../../controllers/applicant.controller";

const employerRoute = Router();

/**
 * create job post :- '/job'
 * edit job put :- '/job/:id'
 * edit personal details put :- '/me'
 * edit company details put :- '/company'
 */

employerRoute.put(
	"/personal-details",
	middlewareWapper(onlyAuthenticated),
	middlewareWapper(onlyEmployers),
	handlerWapper(updatePersonalDetails)
);
employerRoute.put(
	"/company-details",
	middlewareWapper(onlyAuthenticated),
	middlewareWapper(onlyEmployers),
	handlerWapper(updateCompanyDetails)
);

employerRoute.put(
	"/company-logo",
	middlewareWapper(onlyAuthenticated),
	middlewareWapper(onlyEmployers),
	handlerWapper(updateCompanyLogo)
);

export default employerRoute;
