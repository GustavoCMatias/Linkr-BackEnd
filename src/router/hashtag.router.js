import { Router } from "express";
import { getbyHashtag } from "../controller/hashtag.controller.js";
import tokenValidation from "../middleware/authValidation.middleware.js";

const hashtagRouter = Router()

hashtagRouter.get("/hashtag/:hashtag", tokenValidation, getbyHashtag)

export default hashtagRouter