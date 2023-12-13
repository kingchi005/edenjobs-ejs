import { Router, Request, Response } from "express";
import { tryCatchWapper } from "../../controllers/response.controller";

const jobRoute = Router();

/* 
- create job => employer
- edith job /:id => employer
- get job /:id => public
  ...
*/

export default jobRoute;
