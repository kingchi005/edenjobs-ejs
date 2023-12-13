import { Router, Request, Response } from "express";
import { tryCatchWapper } from "../../controllers/response.controller";
import { loginUser, registerUser } from "../../controllers/auth.controller";

const authRoute = Router();

authRoute.post("/login", tryCatchWapper(loginUser));
authRoute.post("/register", tryCatchWapper(registerUser));

export default authRoute;
