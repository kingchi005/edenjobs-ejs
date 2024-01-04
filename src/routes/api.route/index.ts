import { Router, Request, Response } from "express";
import {
	middlewareWapper,
	handlerWapper,
} from "../../controllers/response.controller";
import authRoute from "./auth.route";
import jobRoute from "./job.route";
import jobApplicationRoute from "./application.route";
import formidableMiddleware from "express-formidable";
import { onlyAuthenticated } from "../../controllers/middleware.controller";
import applicantRoute from "./applicant.route";
import employerRoute from "./employer.route";

const apiRoute = Router();
apiRoute.use(formidableMiddleware());
apiRoute.use("/auth", authRoute);

apiRoute.use("/job", jobRoute);
apiRoute.use(
	"/job-application",
	middlewareWapper(onlyAuthenticated),
	jobApplicationRoute
);

apiRoute.use("/applicant", applicantRoute);
apiRoute.use("/employer", employerRoute);

export default apiRoute;
