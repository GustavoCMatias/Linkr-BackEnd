import { Router } from "express";
import { createPost, deletePost, getTimeline, updatePost } from "../controller/timeline.controller.js";
import { deleteLikesPost, validateCreatePost, validateDeleteOrPut, validateToken } from "../middleware/timeline.middleware.js";

const feed = Router()

feed.post('/timeline', validateToken, validateCreatePost, createPost)
feed.get('/timeline', getTimeline)
feed.put('/timeline/:id', validateToken, validateDeleteOrPut, validateCreatePost, updatePost)
feed.delete('/timeline/:id', validateToken, validateDeleteOrPut, deleteLikesPost, deletePost)

export {
    feed
}