import { Router } from "express";
import { createPost, deletePost, getTimeline, updatePost, GetMetadataFromLink, getTimelineById } from "../controller/timeline.controller.js";
import { deleteLikesPost, validateCreatePost, validateDeleteOrPut, validateToken } from "../middleware/timeline.middleware.js";

const feed = Router()

feed.post('/timeline', validateToken, validateCreatePost, createPost)
feed.get('/timeline', getTimeline)
feed.get('/timeline/:id' , getTimelineById)
feed.put('/timeline/:id', validateToken, validateDeleteOrPut, validateCreatePost, updatePost)
feed.delete('/timeline/:id', validateToken, validateDeleteOrPut, deleteLikesPost, deletePost)
feed.get('/link',GetMetadataFromLink)

export {
    feed
}