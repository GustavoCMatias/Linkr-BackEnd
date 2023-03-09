import { Router } from "express";
import { getbyHashtag, trendingHashtags } from "../controller/hashtag.controller.js";
import tokenValidation from "../middleware/authValidation.middleware.js";

const hashtagRouter = Router()

hashtagRouter.get("/hashtag/:hashtag", tokenValidation, getbyHashtag)
hashtagRouter.get("/trending/hashtag", trendingHashtags)

export default hashtagRouter