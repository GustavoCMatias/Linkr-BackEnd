import { Router } from "express";
import { createPost, getTimeline } from "../controller/timeline.controller.js";
import { validateCreatePost } from "../middleware/timeline.middleware.js";

const feed = Router()

feed.post('/timeline', validateCreatePost, createPost)
feed.get('/timeline', getTimeline)
// Ver com o time se preciso de 2 rotas (get e post), visto que a página é tanto 'get' como 'post' (pensando na validação do token)

export {
    feed
}