import { Router, Request, Response } from "express";
import { tryCatchWapper } from "../../controllers/response.controller";

const jobApplicationRoute = Router();

/* 
- create Application => applicant
- get application /:id => user
- edith application /:id => applicant
*/

export default jobApplicationRoute;
