import { Router, Request, Response } from "express";
import { handlerWapper } from "../../controllers/response.controller";
import { searchJobs } from "../../controllers/job.controller";

const jobRoute = Router();

/* 
- create job => employer
- edith job /:id => employer
- get job /:id => public
  ...
*/

jobRoute.get("/s", handlerWapper(searchJobs));

// you can pretect from here
//  middlewareWapper(onlyAuthenticated),

export default jobRoute;
