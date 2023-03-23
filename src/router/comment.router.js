import { Router } from "express";
import { postComment } from "../controller/comment.controller.js";
import tokenValidation from "../middleware/authValidation.middleware.js";
import { validateSchema } from "../middleware/validate.schema.js";
import { CommentSchema } from "../schema/comment.schema.js";

const commentRouter = Router()

commentRouter.post("/comment", validateSchema(CommentSchema), tokenValidation, postComment)

export default commentRouter