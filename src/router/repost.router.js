import { Router } from "express";
import { PostRepost } from "../controller/repost.controller.js";
import tokenValidation from "../middleware/authValidation.middleware.js";
import { validateSchema } from "../middleware/validate.schema.js";
import { postRepostSchema } from "../schema/repost.schema.js";


const repostRouter = Router();

repostRouter.post('/repost', tokenValidation,validateSchema(postRepostSchema), PostRepost);

export default repostRouter;