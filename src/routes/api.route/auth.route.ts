import { Router, Request, Response } from "express";
import { handlerWapper } from "../../controllers/response.controller";
import {
	logOut,
	loginUser,
	registerApplicant,
} from "../../controllers/auth.controller";

const authRoute = Router();

authRoute.post("/login", handlerWapper(loginUser));
authRoute.get("/logout", handlerWapper(logOut));
authRoute.post("/register", handlerWapper(registerApplicant));

export default authRoute;
