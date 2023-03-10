import { Router } from "express";
import { validateLike } from "../controller/likes.controller.js";
import { validateToken } from "../middleware/timeline.middleware.js";

const like = Router()

like.post('/:postId/likes', validateToken, validateLike)

export {
    like
}