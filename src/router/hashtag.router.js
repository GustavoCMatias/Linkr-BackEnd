import { Router } from "express";
import tokenValidation from "../middleware/authValidation.middleware.js";
import { getPostsByHashtag } from "../repository/hashtag.repository.js";

const hashtagRouter = Router()

hashtagRouter.get("/hashtag/:hashtag", tokenValidation, getPostsByHashtag)

export default hashtagRouter