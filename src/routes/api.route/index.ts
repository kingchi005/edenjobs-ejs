import { Router, Request, Response } from "express";
import { tryCatchWapper } from "../../controllers/response.controller";
import authRoute from "./auth.route";
import jobRoute from "./job.route";
import jobApplicationRoute from "./application.route";
import formidableMiddleware from "express-formidable";

const apiRoute = Router();
apiRoute.use(formidableMiddleware());
apiRoute.use("/auth", authRoute);
apiRoute.use("/job", jobRoute);
apiRoute.use("/application", jobApplicationRoute);

export default apiRoute;
